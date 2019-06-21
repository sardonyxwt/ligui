import * as React from 'react';
import { Container } from 'inversify';
import { Translator, LocalizationService } from '../service/localization.service';
import { LIGUI_TYPES } from '../types';

export const LocalizationKeyContext = React.createContext<string>(null);
export const {Consumer: LocalizationKeyContextConsumer, Provider: LocalizationKeyContextProvider} = LocalizationKeyContext;

export const createTranslatorHook = (
  container: Container
) => (
  keys: string[], context?: string
): Translator => {
  const localizationKeyContext = React.useContext(LocalizationKeyContext);

  const [translator, setTranslator] = React.useState<Translator>(resolveTranslator);

  const localizationService = container.get<LocalizationService>(LIGUI_TYPES.LOCALIZATION_SERVICE);

  const localizationContext = context || localizationKeyContext;

  if (!localizationContext) {
    throw new Error('Localization context not set you can use second parameter or LocalizationKeyContextProvider');
  }

  function resolveTranslator() {
    const locale = localizationService.currentLocale;

    const isLocalizationsLoaded = keys
      .map(key => localizationService.isLocalizationLoaded({
        key, context: localizationContext, locale
      }))
      .reduce((v1, v2) => v1 && v2);

    if (isLocalizationsLoaded) {
      return localizationService.getTranslator(localizationContext, locale);
    }

    Promise.all(keys.map(key => localizationService.loadLocalization({
      key, context: localizationContext, locale
    }))).then(() => setTranslator(
      localizationService.getTranslator(localizationContext, locale)
    ));

    return null;
  }

  React.useEffect(() => localizationService.onSetLocale(
    () => setTranslator(resolveTranslator())));

  return translator;
};
