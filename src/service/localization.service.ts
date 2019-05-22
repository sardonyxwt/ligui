import { inject, injectable } from 'inversify';
import { ScopeListener } from '@sardonyxwt/state-store';
import {
  Localization,
  LocalizationScope,
  LocalizationScopeAddLocalizationActionProps,
  LocalizationScopeAddons, LocalizationScopeState,
  Translator
} from '../scope/localization.scope';
import { LIGUI_TYPES } from '../types';
import autobind from 'autobind-decorator';

export type LocalizationLoader = (locale: string, id: string) => Localization | Promise<Localization>;

export interface LocalizationService extends LocalizationScopeAddons {
  loadLocalizations(keys: string[]): Promise<Translator>;
}

@injectable()
@autobind
export class LocalizationServiceImpl implements LocalizationService {

  private _localizationPromises: {[key: string]: Promise<void>} = {};

  constructor(@inject(LIGUI_TYPES.LOCALIZATION_LOADER) private _loader: LocalizationLoader,
              @inject(LIGUI_TYPES.LOCALIZATION_SCOPE) private _scope: LocalizationScope) {}

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

  addLocalization(props: LocalizationScopeAddLocalizationActionProps) {
    this._scope.addLocalization(props);
  }

  changeLocale(locale: string) {
    this._scope.changeLocale(locale);
  }

  isLocalizationsLoaded(keys: string[]) {
    return this._scope.isLocalizationsLoaded(keys);
  }

  onAddLocalization(listener: ScopeListener<LocalizationScopeState>) {
    return this._scope.onAddLocalization(listener);
  }

  onChangeLocale(listener: ScopeListener<LocalizationScopeState>) {
    return this._scope.onChangeLocale(listener);
  }

  translate(path: string) {
    return this._scope.translate(path);
  }

  loadLocalizations(keys: string[]) {
    const {_scope, _loader, _localizationPromises} = this;
    const {currentLocale, defaultLocale, localizations, addLocalization} = _scope;

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
      .then(() => _scope.translate);
  }

}
