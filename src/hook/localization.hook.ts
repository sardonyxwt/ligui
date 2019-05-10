import * as React from 'react';
import { Translator } from '../scope/localization.scope';
import { LocalizationService } from '../service/localization.service';

export const defaultFallbackTranslator = (id) => id;

export const createLocalizationHook = (localizationService: LocalizationService) =>
  (keys: string[], fallbackTranslator: Translator = defaultFallbackTranslator): Translator => {
    const [translator, setTranslator] = React.useState<Translator>(() => {
      if (localizationService.isLocalizationsLoaded(keys)) {
        return localizationService.translate;
      }
      localizationService.loadLocalizations(keys).then(setTranslator);
      return fallbackTranslator;
    });

    React.useEffect(() => localizationService.onChangeLocale(
      () => setTranslator(localizationService.translate)));

    return translator;
  };
