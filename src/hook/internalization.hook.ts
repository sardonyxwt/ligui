import * as React from 'react';
import { Container } from 'inversify';
import { Translator, InternalizationService } from '../service/internalization.service';
import { LIGUI_TYPES } from '../types';

export const InternalizationKeyContext = React.createContext<string>(undefined);
export const {Consumer: InternalizationKeyContextConsumer, Provider: InternalizationKeyContextProvider} = InternalizationKeyContext;

export interface InternalizationHookReturnType {
  setLocale: (locale: string) => void;
  translator: Translator;
  currentLocale: string;
  defaultLocale: string;
  locales: string[];
}

export const createInternalizationHook = (
  container: Container
) => (
  keys: string[], context?: string
): InternalizationHookReturnType => {
  const internalizationKeyContext = React.useContext(InternalizationKeyContext);

  const [translator, setTranslator] = React.useState<Translator>(resolveTranslator);

  const internalizationService = container.get<InternalizationService>(LIGUI_TYPES.INTERNALIZATION_SERVICE);

  const internalizationContext = context || internalizationKeyContext;

  function resolveTranslator() {
    const locale = internalizationService.currentLocale;

    const isTranslateUnitsLoaded = keys
      .map(key => internalizationService.isTranslateUnitLoaded({
        key, context: internalizationContext, locale
      }))
      .reduce((v1, v2) => v1 && v2);

    if (isTranslateUnitsLoaded) {
      return internalizationService.getTranslator(internalizationContext, locale);
    }

    Promise.all(keys.map(key => internalizationService.loadTranslateUnitData({
      key, context: internalizationContext, locale
    }))).then(() => setTranslator(
      internalizationService.getTranslator(internalizationContext, locale)
    ));

    return null;
  }

  React.useEffect(() => internalizationService.onSetLocale(
    () => setTranslator(resolveTranslator())));

  return {
    translator,
    setLocale: internalizationService.setLocale,
    currentLocale: internalizationService.currentLocale,
    defaultLocale: internalizationService.defaultLocale,
    locales: internalizationService.locales
  };
};
