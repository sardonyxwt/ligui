import * as React from 'react';
import { uniqueId } from '@sardonyxwt/utils/generator';
import { LocalizationService, Translator } from '..';

export const defaultFallbackTranslator = (id) => id;

export type LocalizationHookType = (keys: string[], fallbackTranslator?: Translator) => Translator;

export const createLocalizationHookInstance = (localizationService: LocalizationService): LocalizationHookType => {
  const subscribers: {[key: string]: Function} = {};

  localizationService.onChangeLocale(() =>
    Object.getOwnPropertyNames(subscribers).forEach(key => subscribers[key]()));

  return (keys: string[], fallbackTranslator: Translator = null) => {
    const [translator, setTranslator] = React.useState<Translator>(() => {
      if (localizationService.isLocalizationsLoaded(keys)) {
        return localizationService.translate;
      }
      localizationService.loadLocalizations(keys).then(setTranslator);
      return fallbackTranslator;
    });

    React.useEffect(() => {
      const listenerId = uniqueId('LigLocalizationHook');
      subscribers[listenerId] = () => setTranslator(localizationService.translate);
      return () => delete subscribers[listenerId];
    });

    return translator;
  }
};
