import * as SynchronizedUtil from '@sardonyxwt/utils/synchronized';
import * as JSONUtil from '@sardonyxwt/utils/json';
import { createScope, Scope } from '@sardonyxwt/state-store';

export type Translator = (key: string) => string;

export interface Localization {
  [key: string]: string
}

export interface LocalizationServiceState {
  locales: string[];
  defaultLocale: string;
  currentLocale: string;
  localizations: { [key: string]: Localization }
}

export interface LocalizationServiceConfig {
  loader: (locale: string, id: string) => Promise<Localization>;
  initState: LocalizationServiceState;
}

export interface LocalizationService {
  changeLocale(locale: string): Promise<LocalizationServiceState>;

  getScope(): Scope<LocalizationServiceState>;

  getLocales(): string[];

  getDefaultLocale(): string;

  getCurrentLocale(): string;

  subscribe(id: string | string[], subscriber: (t: Translator) => void): void;

  configure(config: LocalizationServiceConfig): void;
}

interface Subscriber {
  id: string | string[];
  callback: (t: Translator) => void;
}

export const LOCALIZATION_SCOPE_NAME = 'LOCALIZATION_SCOPE';
export const LOCALIZATION_SCOPE_ACTION_ADD = 'ADD_LOCALIZATION';
export const LOCALIZATION_SCOPE_ACTION_CHANGE = 'CHANGE_LOCALIZATION';

class LocalizationServiceImpl implements LocalizationService {

  private scope: Scope<LocalizationServiceState>;
  private localizationCache: SynchronizedUtil.SynchronizedCache<Localization>;
  private subscribers: Subscriber[] = [];

  changeLocale(locale: string): Promise<LocalizationServiceState> {
    return this.scope.dispatch(LOCALIZATION_SCOPE_ACTION_CHANGE, locale);
  }

  getScope() {
    return this.scope;
  }

  getLocales(): string[] {
    return this.scope.getState().locales.slice();
  }

  getDefaultLocale(): string {
    return this.scope.getState().defaultLocale;
  }

  getCurrentLocale(): string {
    return this.scope.getState().currentLocale;
  }

  subscribe(id: string | string[], callback: (t: Translator) => void) {

    const {scope, localizationCache} = this;

    this.subscribers.push({id, callback});

    let createLocalizationPromise = (id: string) => {

      let localizationId = `${scope.getState().currentLocale}:${id}`;
      let localization = scope.getState().localizations[localizationId];

      if (localization) {
        return Promise.resolve(localization);
      }

      const isFirstCall = !localizationCache.has(localizationId);
      return this.localizationCache.get(localizationId).then(localization => {
        if (isFirstCall) {
          scope.dispatch(
            LOCALIZATION_SCOPE_ACTION_ADD,
            {id, localization}
          ).then(
            () => localizationCache.remove(localizationId)
          );
        }
        return localization;
      });
    };

    callback(id => id);


    if (Array.isArray(id)) {
      let resultLocalization = {};

      const localizationPromises = id.map(
        id => createLocalizationPromise(id).then(
          localization => resultLocalization[id] = localization
        )
      );

      SynchronizedUtil.syncPromises(localizationPromises).then(
        () => {
          let localization = JSONUtil.flatten(resultLocalization);
          callback((key: string) => localization[key])
        }
      )
    } else {
      createLocalizationPromise(id).then(
        localization => callback((key: string) => localization[key])
      );
    }

  }

  configure(config: LocalizationServiceConfig) {
    if (this.scope) {
      throw new Error('ResourceService must configure only once.');
    }
    this.scope = createScope<LocalizationServiceState>(
      LOCALIZATION_SCOPE_NAME,
      config.initState
    );
    this.scope.registerAction(
      LOCALIZATION_SCOPE_ACTION_ADD,
      (scope, {id, localization}, resolve) => {
        const localizations = Object.assign(
          scope.localizations,
          {[id]: localization}
        );
        resolve(Object.assign(scope, {localizations}));
      }
    );
    this.scope.registerAction(
      LOCALIZATION_SCOPE_ACTION_CHANGE,
      (scope, currentLocale, resolve) => {
        const isSupportLocale = scope.locales.find(
          locale => locale === currentLocale
        );
        if (!isSupportLocale) {
          throw new Error('Locale not supported.');
        }
        const subscribers = this.subscribers.slice();
        this.subscribers = [];
        subscribers.forEach(({id, callback}) => this.subscribe(id, callback));
        resolve(Object.assign(scope, {currentLocale}));
      }
    );
    this.scope.lock();
    this.localizationCache = SynchronizedUtil.createSyncCache<Localization>((key: string) => {
      const [locale, id] = key.split(':');
      return config.loader(locale, id);
    });
  }

}

export const localizationService: LocalizationService = new LocalizationServiceImpl();
