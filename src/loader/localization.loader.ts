import { localizationScope, Localization, Translator } from '../scope/localization.scope';

export type LLoader = (locale: string, id: string) => Localization | Promise<Localization>;

export interface LocalizationLoader {
  loader: LLoader;
  loadLocalizations(keys: string[]): Promise<Translator>
}

class LocalizationLoaderImpl implements LocalizationLoader {

  private _loader: LLoader;
  private readonly _localizationPromises: {[key: string]: Promise<void>} = {};

  loadLocalizations(keys: string[]): Promise<Translator> {
    const {_loader, _localizationPromises} = this;
    const {currentLocale, defaultLocale, localizations, addLocalization} = localizationScope;

    let createLocalizationPromise = (key: string) => {
      let localizationKey = `${currentLocale}:${key}`;

      if (!(localizationKey in _localizationPromises)) {
        if (localizations[currentLocale] && localizations[currentLocale][key]) {
          _localizationPromises[localizationKey] = Promise.resolve();
        } else {
          _localizationPromises[localizationKey] =
            Promise.resolve(_loader(currentLocale, key))
              .then(null, () => _loader(defaultLocale, key))
              .then(localization => addLocalization({locale: currentLocale, key, localization}));
        }
      }
      return _localizationPromises[localizationKey];
    };

    return Promise.all(keys.map(key => createLocalizationPromise(key)))
      .then(() => localizationScope.translator);
  }

  set loader(loader: LLoader) {
    this._loader = loader;
  }

  get loader() {
    return this._loader;
  }

}

export const localizationLoader: LocalizationLoader = new LocalizationLoaderImpl();
