import { Localization, LocalizationScope, Translator } from '../scope/localization.scope';

export type LocalizationPartLoader = (locale: string, id: string) => Localization | Promise<Localization>;
export type LocalizationLoader = (keys: string[]) => Promise<Translator>;

export function createLocalizationLoader(
  localizationScope: LocalizationScope,
  loader: LocalizationPartLoader
): LocalizationLoader {
  const localizationPromises: {[key: string]: Promise<void>} = {};

  return (keys: string[]) => {
    const {currentLocale, defaultLocale, localizations, addLocalization} = localizationScope;

    let createLocalizationPromise = (key: string) => {
      let localizationKey = `${currentLocale}:${key}`;

      if (!(localizationKey in localizationPromises)) {
        if (localizations[currentLocale] && localizations[currentLocale][key]) {
          localizationPromises[localizationKey] = Promise.resolve();
        } else {
          localizationPromises[localizationKey] =
            Promise.resolve(loader(currentLocale, key))
              .then(null, () => loader(defaultLocale, key))
              .then(localization => addLocalization({locale: currentLocale, key, localization}));
        }
      }
      return localizationPromises[localizationKey];
    };

    return Promise.all(keys.map(key => createLocalizationPromise(key)))
      .then(() => localizationScope.translate);
  }
}
