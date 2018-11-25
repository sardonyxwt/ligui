import * as React from 'react';
import { uniqueId } from '@sardonyxwt/utils/generator';
import { localizationService, Translator } from '..';

const subscribers: {[key: string]: Function} = {};

localizationService.onChangeLocale(() =>
  Object.getOwnPropertyNames(subscribers).forEach(key => subscribers[key]()));

export const defaultFallbackTranslator = (id) => id;

export function useLocalization(keys: string[], fallbackTranslator: Translator = null) {
  const listenerId = uniqueId('UseLocalizationHook');
  const [translator, setTranslator] = React.useState<Translator>(
    localizationService.isLocalizationsLoaded(keys)
      ? () => localizationService.translate
      : () => fallbackTranslator
  );

  const updateTranslator = () =>
    localizationService.loadLocalizations(keys).then(setTranslator);

  if (!localizationService.isLocalizationsLoaded(keys)) {
    updateTranslator();
  }

  React.useEffect(() => {
    subscribers[listenerId] = updateTranslator;
    return () => delete subscribers[listenerId];
  });

  return translator;
}
