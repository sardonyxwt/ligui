import * as React from 'react';
import { Container } from 'inversify';
import { Translator, LocalizationService } from '../service/localization.service';
import { LIGUI_TYPES } from '../types';

export const createTranslatorHook = (
  container: Container
) => (
  keys: string[]
): Translator => {
  const localizationService = container.get<LocalizationService>(LIGUI_TYPES.LOCALIZATION_SERVICE);

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

    return null;
  }

  React.useEffect(() => localizationService.onChangeLocale(
    () => setTranslator(resolveTranslator())));

  return translator;
};
