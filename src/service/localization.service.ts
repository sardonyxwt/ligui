import * as JSONUtil from '@sardonyxwt/utils/json';
import {createSyncScope, SyncScope} from '@sardonyxwt/state-store';

export type Translator = (key: string) => string;

export interface Localization {
  [key: string]: string
}

export interface LocalizationServiceState {
  locales: string[];
  defaultLocale: string;
  currentLocale: string;
  localizations: { [locale: string]: Localization }
}

export interface LocalizationServiceConfig {
  loader: (locale: string, id: string) => Promise<Localization>;
  initState: LocalizationServiceState;
}

export interface LocalizationService {
  readonly locales: string[];
  readonly defaultLocale: string;
  readonly currentLocale: string;
  readonly translator: Translator;
  readonly scope: SyncScope<LocalizationServiceState>;
  onLocaleChange(callback: (oldLocale: string, newLocale: string) => void): void;
  changeLocale(locale: string): void;
  loadLocalizations(id: string | string[]): Promise<void>
  configure(config: LocalizationServiceConfig): void;
}

export const LOCALIZATION_SCOPE_NAME = 'LOCALIZATION_SCOPE';
export const LOCALIZATION_SCOPE_ACTION_ADD = 'add';
export const LOCALIZATION_SCOPE_ACTION_CHANGE_LOCALE = 'changeLocale';

class LocalizationServiceImpl implements LocalizationService {

  private _loader: (locale: string, id: string) => Promise<Localization>;
  private _scope: SyncScope<LocalizationServiceState>;
  private _localizationPromises: {[key: string]: Promise<void>} = {};

  get locales(): string[] {
    return this._scope.state.locales.slice();
  }

  get defaultLocale(): string {
    return this._scope.state.defaultLocale;
  }

  get currentLocale(): string {
    return this._scope.state.currentLocale;
  }

  get translator(): Translator {
    return id => this._scope.state.localizations[this.currentLocale][id];
  }

  get scope() {
    return this._scope;
  }

  onLocaleChange(callback: (oldLocale: string, newLocale: string) => void) {
    this._scope.subscribe(({oldState, newState}) =>
      callback(oldState.currentLocale, newState.currentLocale));
  }

  changeLocale(locale: string): void {
    this._scope.dispatch(LOCALIZATION_SCOPE_ACTION_CHANGE_LOCALE, locale);
  }

  loadLocalizations(id: string | string[]): Promise<void> {
    const {_scope, _loader, currentLocale} = this;

    const ids = Array.isArray(id) ? [...id] : [id];

    let createLocalizationPromise = (id: string) => {
      let localizationId = `${currentLocale}:${id}`;

      if (!(localizationId in this._localizationPromises)) {
        this._localizationPromises[localizationId] = _loader(currentLocale, id)
          .then(localization => {
            _scope.dispatch(
              LOCALIZATION_SCOPE_ACTION_ADD,
              {currentLocale, id, localization}
            );
          });
      }
      return this._localizationPromises[localizationId];
    };

    return Promise.all(ids.map(id => createLocalizationPromise(id)))
      .then(() => null);
  }

  configure(config: LocalizationServiceConfig) {
    if (this._scope) {
      throw new Error('ResourceService must configure only once.');
    }
    this._scope = createSyncScope<LocalizationServiceState>(
      LOCALIZATION_SCOPE_NAME,
      config.initState
    );
    this.scope.registerAction(
      LOCALIZATION_SCOPE_ACTION_ADD,
      (state, {currentLocale, id, localization}) => {
        const localizations = {
          ...state.localizations,
          [currentLocale]: JSONUtil.flatten({
            ...state.localizations[currentLocale],
            [id]: localization
          })
        };
        return {...state, localizations};
      }
    );
    this.scope.registerAction(
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
    this.scope.lock();
  }

}

export const localizationService: LocalizationService = new LocalizationServiceImpl();
