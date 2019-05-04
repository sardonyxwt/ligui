import * as React from 'react';
import { Context } from '../context';
import { useDependency } from './dependency.hook';
import { Translator } from '../scope/localization.scope';
import { LocalizationService } from '../service/localization.service';
import { LIGUI_TYPES } from '../types';

export const defaultFallbackTranslator = (id) => id;

export type LocalizationHookType = (context: Context, keys: string[], fallbackTranslator?: Translator) => Translator;

export function useLocalization (context: Context, keys: string[],
                                 fallbackTranslator: Translator = defaultFallbackTranslator) {
  const localizationService = useDependency<LocalizationService>(context, LIGUI_TYPES.LOCALIZATION_SERVICE);

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
}
