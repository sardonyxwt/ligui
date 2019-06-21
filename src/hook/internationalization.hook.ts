import * as React from 'react';
import { Container } from 'inversify';
import { Translator, InternationalizationService } from '../service/internationalization.service';
import { LIGUI_TYPES } from '../types';

export const InternationalizationKeyContext = React.createContext<string>(undefined);
export const {Consumer: I18nKeyContextConsumer, Provider: I18nKeyContextProvider} = InternationalizationKeyContext;

export interface InternationalizationHookReturnType {
  setLocale: (locale: string) => void;
  translator: Translator;
  currentLocale: string;
  defaultLocale: string;
  locales: string[];
}

export const createI18nHook = (
  container: Container
) => (
  keys: string[], context?: string
): InternationalizationHookReturnType => {
  const internationalizationKeyContext = React.useContext(InternationalizationKeyContext);

  const [translator, setTranslator] = React.useState<Translator>(resolveTranslator);

  const internationalizationService = container.get<InternationalizationService>(LIGUI_TYPES.INTERNATIONALIZATION_SERVICE);

  const internationalizationContext = context || internationalizationKeyContext;

  function resolveTranslator() {
    const locale = internationalizationService.currentLocale;

    const isTranslateUnitsLoaded = keys
      .map(key => internationalizationService.isTranslateUnitLoaded({
        key, context: internationalizationContext, locale
      }))
      .reduce((v1, v2) => v1 && v2);

    if (isTranslateUnitsLoaded) {
      return internationalizationService.getTranslator(internationalizationContext, locale);
    }

    Promise.all(keys.map(key => internationalizationService.loadTranslateUnitData({
      key, context: internationalizationContext, locale
    }))).then(() => setTranslator(
      internationalizationService.getTranslator(internationalizationContext, locale)
    ));

    return null;
  }

  React.useEffect(() => internationalizationService.onSetLocale(
    () => setTranslator(resolveTranslator())));

  return {
    translator,
    setLocale: internationalizationService.setLocale,
    currentLocale: internationalizationService.currentLocale,
    defaultLocale: internationalizationService.defaultLocale,
    locales: internationalizationService.locales
  };
};
