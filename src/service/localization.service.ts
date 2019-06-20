import { inject, injectable } from 'inversify';
import { ScopeListener } from '@sardonyxwt/state-store';
import {
  Localization,
  LocalizationScope,
  LocalizationScopeAddLocalizationActionProps,
  LocalizationScopeAddons, LocalizationScopeState,
} from '../scope/localization.scope';
import { LIGUI_TYPES } from '../types';

export type Translator = (key: string) => string;

export type LocalizationLoader = (locale: string, id: string, cb: (localization: Localization) => void) => void;

export interface LocalizationService extends LocalizationScopeAddons {
  translator: Translator;
  getLocalization(key: string): Localization
  loadLocalization(key: string): Promise<Localization>;
}

@injectable()
export class LocalizationServiceImpl implements LocalizationService {

  private _localizationPromises: {[key: string]: Promise<Localization>} = {};
  private _translator: Translator = (path: string) => {
    const [key, ...pathParts] = path.split(/[.\[\]]/).filter(it => it !== '');

    let result = this.getLocalization(key);

    for (let i = 0; i < pathParts.length && !!result; i++) {
      result = result[pathParts[i]];
    }

    return result as unknown as string;
  };

  constructor(@inject(LIGUI_TYPES.LOCALIZATION_LOADER) protected _loader: LocalizationLoader,
              @inject(LIGUI_TYPES.LOCALIZATION_SCOPE) protected _scope: LocalizationScope) {}

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

  setLocalization(props: LocalizationScopeAddLocalizationActionProps) {
    this._scope.setLocalization(props);
  }

  getLocalization(key: string): Localization {
    const {currentLocale, localizations} = this;
    return localizations[currentLocale] ? localizations[currentLocale][key] : null;
  }

  changeLocale(locale: string) {
    this._scope.changeLocale(locale);
  }

  isLocalizationLoaded(key: string) {
    return this._scope.isLocalizationLoaded(key);
  }

  onSetLocalization(listener: ScopeListener<LocalizationScopeState>) {
    return this._scope.onSetLocalization(listener);
  }

  onChangeLocale(listener: ScopeListener<LocalizationScopeState>) {
    return this._scope.onChangeLocale(listener);
  }

  loadLocalization(key: string) {
    const {_scope, _loader, _localizationPromises} = this;
    const {currentLocale, defaultLocale, localizations, setLocalization} = _scope;

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
              setLocalization({locale: currentLocale, key, localization});
              return localization;
            });
      }
    }
    return _localizationPromises[localizationKey];
  }

}
