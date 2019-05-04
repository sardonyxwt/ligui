import * as React from 'react';
import { Context } from '@src/context';
import { useDependency } from '@src/hook/dependency.hook';
import { Translator } from '@src/scope/localization.scope';
import { LocalizationService } from '@src/service/localization.service';
import { LiguiTypes } from '@src/types';

export const defaultFallbackTranslator = (id) => id;

export type LocalizationHookType = (context: Context, keys: string[], fallbackTranslator?: Translator) => Translator;

export function useLocalization (context: Context, keys: string[],
                                 fallbackTranslator: Translator = defaultFallbackTranslator) {
  const localizationService = useDependency<LocalizationService>(context, LiguiTypes.LOCALIZATION_SERVICE);

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
