import * as React from 'react';
import { Translator, LocalizationService } from '../service/localization.service';

export const defaultFallbackTranslator = (id) => id;

export const createTranslatorHook = (
  localizationService: LocalizationService
) => (
  keys: string[],
  fallbackTranslator: Translator = defaultFallbackTranslator
): Translator => {
  const [translator, setTranslator] = React.useState<Translator>(resolveTranslator);

  function resolveTranslator() {
    const isLocalizationsLoaded = keys
      .map(it => localizationService.isLocalizationLoaded(it))
      .reduce((v1, v2) => v1 && v2);

    if (isLocalizationsLoaded) {
      return localizationService.translator;
    }

    Promise.all(keys.map(it => localizationService.loadLocalization(it)))
      .then(() => setTranslator(localizationService.translator));

    return fallbackTranslator;
  }

  React.useEffect(() => localizationService.onChangeLocale(
    () => setTranslator(resolveTranslator())));

  return translator;
};
