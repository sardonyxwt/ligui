import { ScopeListener } from '@sardonyxwt/state-store';
import {
  Localization,
  LocalizationScope,
  LocalizationScopeAddLocalizationActionProps,
  LocalizationScopeAddons, LocalizationScopeState,
} from './localization.scope';
import autobind from 'autobind-decorator';

export type Translator = (key: string) => string;

export type LocalizationLoader = (locale: string, id: string, cb: (localization: Localization) => void) => void;

export interface LocalizationService extends LocalizationScopeAddons {
  translator: Translator;
  loadLocalization(key: string): Promise<Localization>;
}

@autobind
export class LocalizationServiceImpl implements LocalizationService {

  private _localizationPromises: {[key: string]: Promise<Localization>} = {};
  private _translator: Translator = (path: string) => {
    const {state} = this._scope;

    if (!state || typeof path !== 'string') {
      return null;
    }

    const {currentLocale, localizations} = state;

    let result = localizations[currentLocale];
    const pathParts = path.split(/[.\[\]]/).filter(it => it !== '');

    for (let i = 0; i < pathParts.length; i++) {
      result = result[pathParts[i]];
      if (!result) {
        break;
      }
    }

    return result as any as string;
  };

  constructor(private _loader: LocalizationLoader,
              private _scope: LocalizationScope) {}

  get currentLocale () {
    return this._scope.currentLocale
  }
  get currentLocalization () {
    return this._scope.currentLocalization
  }
  get defaultLocale () {
    return this._scope.defaultLocale
  }
  get locales () {
    return this._scope.locales
  }
  get localizations () {
    return this._scope.localizations
  }

  get translator() {
    return this._translator;
  }

  addLocalization(props: LocalizationScopeAddLocalizationActionProps) {
    this._scope.addLocalization(props);
  }

  changeLocale(locale: string) {
    this._scope.changeLocale(locale);
  }

  isLocalizationLoaded(key: string) {
    return this._scope.isLocalizationLoaded(key);
  }

  onAddLocalization(listener: ScopeListener<LocalizationScopeState>) {
    return this._scope.onAddLocalization(listener);
  }

  onChangeLocale(listener: ScopeListener<LocalizationScopeState>) {
    return this._scope.onChangeLocale(listener);
  }

  loadLocalization(key: string) {
    const {_scope, _loader, _localizationPromises} = this;
    const {currentLocale, defaultLocale, localizations, addLocalization} = _scope;

    let localizationKey = `${currentLocale}:${key}`;

    if (!(localizationKey in _localizationPromises)) {
      if (localizations[currentLocale] && localizations[currentLocale][key]) {
        _localizationPromises[localizationKey] = Promise.resolve(localizations[currentLocale][key]);
      } else {
        _localizationPromises[localizationKey] =
          new Promise<Localization>(resolve => _loader(currentLocale, key, resolve))
            .then(null, () => new Promise<Localization>(
              resolve => _loader(defaultLocale, key, resolve)))
            .then(localization => {
              addLocalization({locale: currentLocale, key, localization});
              return localization;
            });
      }
    }
    return _localizationPromises[localizationKey];
  }

}
