import { localizationScope, Localization, Translator } from '..';

export type LLoader = (locale: string, id: string) => Localization | Promise<Localization>;

export interface LocalizationLoader {
  loader: LLoader;
  loadLocalizations(keys: string[]): Promise<Translator>
}

let loader: LLoader;
const localizationPromises: {[key: string]: Promise<void>} = {};

export const localizationLoader: LocalizationLoader = Object.assign({
  loadLocalizations(keys: string[]): Promise<Translator> {
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
  },
  set loader(newLoader: LLoader) {
    loader = newLoader;
  },
  get loader() {
    return loader;
  }
});
