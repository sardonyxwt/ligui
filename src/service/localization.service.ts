import { ScopeListener, ScopeListenerUnsubscribeCallback } from '@sardonyxwt/state-store';
import {
  Localization,
  LocalizationData,
  LocalizationIdentifier,
  LocalizationScope,
  LocalizationScopeState,
  LocalizationScopeAddons, localizationIdComparator
} from '../scope/localization.scope';
import { deleteFromArray, saveToArray } from '../extension/util.extension';

export type Translator = (key: string) => string;

export interface LocalizationLoader {
  context: string;
  loader: (key: string, locale: string) => Promise<LocalizationData>;
}

export interface LocalizationPromise extends LocalizationIdentifier {
  promise: Promise<any>;
}

export interface LocalizationService extends LocalizationScopeAddons {
  getTranslator(context: string, locale?: string): Translator;
  registerLocalizationLoader<T>(loader: LocalizationLoader);
  loadLocalization(id: LocalizationIdentifier): Promise<Localization>;
}

export class LocalizationServiceImpl implements LocalizationService {

  private _localizationPromises: LocalizationPromise[] = [];

  constructor(protected _scope: LocalizationScope,
              protected _localizationLoaders: LocalizationLoader[] = []) {}

  get currentLocale() {
    return this._scope.currentLocale;
  };

  get defaultLocale() {
    return this._scope.defaultLocale;
  };

  get locales() {
    return this._scope.locales;
  };

  get localizations() {
    return this._scope.localizations;
  };

  registerLocalizationLoader<T>(loader: LocalizationLoader) {
    deleteFromArray(this._localizationPromises, modulePromise => modulePromise.context === loader.context);
    saveToArray(this._localizationLoaders, loader, moduleLoader => moduleLoader.context === loader.context);
  }

  getLocalizationData(id: LocalizationIdentifier): LocalizationData {
    return this._scope.getLocalizationData(id);
  }

  getTranslator(context: string, locale?: string): Translator {
    return (path: string) => {
      const [key, ...pathParts] = path.split(/[.\[\]]/).filter(it => it !== '');

      const localizationId: LocalizationIdentifier = {key, context, locale: locale || this.currentLocale};

      let result = this.getLocalizationData(localizationId);

      for (let i = 0; i < pathParts.length && !!result; i++) {
        result = result[pathParts[i]] as LocalizationData;
      }

      return result as unknown as string;
    };
  }

  isLocaleAvailable(locale: string): boolean {
    return this._scope.isLocaleAvailable(locale);
  }

  isLocalizationLoaded(id: LocalizationIdentifier): boolean {
    return this._scope.isLocalizationLoaded(id);
  }

  loadLocalization(id: LocalizationIdentifier): Promise<Localization> {
    const {_localizationPromises, _localizationLoaders, _scope} = this;
    const {setLocalization, getLocalizationData} = _scope;

    const localizationPromise = _localizationPromises.find(localizationIdComparator(id));

    if (localizationPromise) {
      return localizationPromise.promise;
    }

    const localizationData = getLocalizationData(id);

    if (localizationData) {
      const newLocalizationPromise: LocalizationPromise = {
        ...id, promise: Promise.resolve(localizationData)
      };
      _localizationPromises.push(newLocalizationPromise);
      return newLocalizationPromise.promise;
    }

    const localizationLoader = _localizationLoaders.find(it => it.context === id.context);

    if (!localizationLoader) {
      throw new Error(`Localization loader for key ${JSON.stringify(id)} not found`);
    }

    const newLocalizationPromise: LocalizationPromise = {
      ...id, promise: localizationLoader.loader(id.key, id.locale).then(localizationData => {
        setLocalization({...id, data: localizationData});
        return localizationData;
      })
    };

    _localizationPromises.push(newLocalizationPromise);

    return newLocalizationPromise.promise;
  }

  onSetLocale(listener: ScopeListener<LocalizationScopeState>): ScopeListenerUnsubscribeCallback {
    return this._scope.onSetLocale(listener);
  }

  onSetLocalization(listener: ScopeListener<LocalizationScopeState>): ScopeListenerUnsubscribeCallback {
    return this._scope.onSetLocalization(listener);
  }

  setLocale(locale: string): void {
    this._scope.setLocale(locale);
  }

  setLocalization(localization: Localization): void {
    this._scope.setLocalization(localization);
  }

}
