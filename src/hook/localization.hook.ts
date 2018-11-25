import * as React from 'react';
import { uniqueId } from '@sardonyxwt/utils/generator';
import { localizationService, Translator } from '..';

const subscribers: {[key: string]: Function} = {};

localizationService.onChangeLocale(() =>
  Object.getOwnPropertyNames(subscribers).forEach(key => subscribers[key]()));

export const defaultFallbackTranslator = (id) => id;

export function useLocalization(keys: string[], fallback?: Translator) {
  const listenerId = uniqueId('UseLocalizationHook');
  const [translator, setTranslator] = React.useState<Translator>(null);

  const setupTranslator = () => setTranslator(() => localizationService.translate);

  if (localizationService.isLocalizationsLoaded(keys)) {
    setupTranslator();
  }

  const updateTranslator = () => localizationService.loadLocalizations(keys).then(setupTranslator);

  React.useEffect(() => {
    subscribers[listenerId] = updateTranslator;
    return () => delete subscribers[listenerId];
  });

  return translator || fallback;
}
