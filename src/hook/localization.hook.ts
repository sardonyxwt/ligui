import * as React from 'react';
import { createUniqueIdGenerator } from '@sardonyxwt/utils/generator';
import { localizationService, Translator } from '..';

export const defaultFallbackTranslator = (id) => id;

export type LocalizationHookType = (keys: string[], fallbackTranslator?: Translator) => Translator;

const subscribers: {[key: string]: Function} = {};
const localizationHookListenerIdGenerator = createUniqueIdGenerator('LocalizationHook');

localizationService.onChangeLocale(() =>
  Object.getOwnPropertyNames(subscribers).forEach(key => subscribers[key]()));

export function LocalizationHook (keys: string[], fallbackTranslator: Translator = null) {
  const [translator, setTranslator] = React.useState<Translator>(() => {
    if (localizationService.isLocalizationsLoaded(keys)) {
      return localizationService.translate;
    }
    localizationService.loadLocalizations(keys).then(setTranslator);
    return fallbackTranslator;
  });

  React.useEffect(() => {
    const listenerId = localizationHookListenerIdGenerator();
    subscribers[listenerId] = () => setTranslator(localizationService.translate);
    return () => delete subscribers[listenerId];
  });

  return translator;
}
