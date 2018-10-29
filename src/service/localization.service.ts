import { createSyncScope, SyncScope } from '@sardonyxwt/state-store';

export type LocalizationLoader = (locale: string, id: string) => Localization | Promise<Localization>;
export type Translator = (key: string) => string;

export interface Localization {
  [key: string]: Localization
}

export interface LocalizationScopeState {
  locales: string[];
  defaultLocale: string;
  currentLocale: string;
  localizations: { [locale: string]: Localization }
}

export const LOCALIZATION_SCOPE_NAME = 'LOCALIZATION_SCOPE';
export const LOCALIZATION_SCOPE_ACTION_SET = 'setLocalization';
export const LOCALIZATION_SCOPE_ACTION_CHANGE_LOCALE = 'changeLocale';

export interface LocalizationScope extends SyncScope<LocalizationScopeState> {
  [LOCALIZATION_SCOPE_ACTION_SET](props: {locale: string, id: string, localization: Localization})
  [LOCALIZATION_SCOPE_ACTION_CHANGE_LOCALE](locale: string)
}

export interface LocalizationServiceConfig {
  loader?: LocalizationLoader;
  initState: LocalizationScopeState;
}

export interface LocalizationService {
  readonly locales: string[];
  readonly defaultLocale: string;
  readonly currentLocale: string;
  readonly translator: Translator;
  readonly scope: LocalizationScope;
  onLocaleChange(callback: (oldLocale: string, newLocale: string) => void): void;
  changeLocale(locale: string): void;
  loadLocalizations(id: string | string[]): Promise<Translator>
  configure(config: LocalizationServiceConfig): void;
}

class LocalizationServiceImpl implements LocalizationService {

  private _loader: LocalizationLoader;
  private _scope: LocalizationScope = null;
  private _translator: Translator;
  private _localizationPromises: {[key: string]: Promise<void>} = {};

  get locales(): string[] {
    return this._scope.state.locales;
  }

  get defaultLocale(): string {
    return this._scope.state.defaultLocale;
  }

  get currentLocale(): string {
    return this._scope.state.currentLocale;
  }

  get translator(): Translator {
    return this._translator;
  }

  get scope() {
    return this._scope;
  }

  onLocaleChange(callback: (oldLocale: string, newLocale: string) => void) {
    this._scope.subscribe(({oldState, newState}) =>
      callback(oldState.currentLocale, newState.currentLocale));
  }

  changeLocale(locale: string): void {
    this._scope.changeLocale(locale);
  }

  loadLocalizations(id: string | string[]): Promise<Translator> {
    const {_scope, _loader, currentLocale} = this;

    const ids = Array.isArray(id) ? [...id] : [id];

    let createLocalizationPromise = (id: string) => {
      let localizationId = `${currentLocale}:${id}`;

      if (!(localizationId in this._localizationPromises)) {
        if (_scope.state.localizations[currentLocale] && _scope.state.localizations[currentLocale][id]) {
          this._localizationPromises[localizationId] = Promise.resolve();
        } else {
          this._localizationPromises[localizationId] = Promise.resolve(_loader(currentLocale, id))
            .then(localization => {
              _scope.setLocalization({locale: currentLocale, id, localization});
            });
        }
      }
      return this._localizationPromises[localizationId];
    };

    return Promise.all(ids.map(id => createLocalizationPromise(id)))
      .then(() => this._translator);
  }

  configure({initState, loader}: LocalizationServiceConfig) {
    this._scope = this.configureScope(initState);
    this._translator = this.configureTranslator();
    this._loader = loader;
  }

  private configureScope(initState: LocalizationScopeState) {

    const scope = createSyncScope<LocalizationScopeState>(
      LOCALIZATION_SCOPE_NAME,
      initState
    ) as LocalizationScope;

    scope.registerAction(
      LOCALIZATION_SCOPE_ACTION_SET,
      (state, {locale, id, localization}) => {
        const localizations = {
          ...state.localizations,
          [locale]: {
            ...state.localizations[locale],
            [id]: localization
          }
        };
        return {...state, localizations};
      }
    );

    scope.registerAction(
      LOCALIZATION_SCOPE_ACTION_CHANGE_LOCALE,
      (state, currentLocale: string) => {
        const isSupportLocale = state.locales.find(
          locale => locale === currentLocale
        );
        if (!isSupportLocale) {
          throw new Error('Locale not supported.');
        }
        return {...state, currentLocale};
      }
    );

    scope.lock();

    return scope;
  };

  private configureTranslator(): Translator {
    const results = {};
    return (path: string) => {
      const currentLocale = this._scope.state.currentLocale;

      const resultKey = `${currentLocale}.${path}`;
      if (resultKey in results) {
        return results[resultKey];
      }

      const pathParts = path.split('.');

      let result = this._scope.state.localizations[currentLocale];
      for (let i = 0; i < pathParts.length; i++) {
        let pathPart = pathParts[i];
        if (pathPart in result) {
          result = result[pathPart];
        } else {
          return `I18N(${currentLocale} ${path}): localization not present.`;
        }
      }
      results[resultKey] = result;
      return result as any as string;
    }
  }

}

export const localizationService: LocalizationService = new LocalizationServiceImpl();
