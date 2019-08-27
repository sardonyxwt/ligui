import * as React from 'react';
import { Container } from 'inversify';
import { Translator, InternationalizationService } from '../service/internationalization.service';
import { LIGUI_TYPES } from '../types';

let InternationalizationKeyContext: React.Context<string> = null;

if (!!React) {
  InternationalizationKeyContext = React.createContext<string>(undefined);
}

export { InternationalizationKeyContext };

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
  const internationalizationService = container.get<InternationalizationService>(LIGUI_TYPES.INTERNATIONALIZATION_SERVICE);

  const internationalizationKeyContext = React.useContext(InternationalizationKeyContext);

  const [translator, setTranslator] = React.useState<Translator>(() => resolveTranslator());

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

    return null;
  }

  React.useEffect(() => {
    const locale = internationalizationService.currentLocale;

    if (!translator) {
      Promise.all(keys.map(key => internationalizationService.loadTranslateUnitData({
        key, context: internationalizationContext, locale
      }))).then(() => setTranslator(
        internationalizationService.getTranslator(internationalizationContext, locale)
      ));
    }
  }, [translator]);

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
