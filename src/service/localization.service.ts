import { inject, injectable } from 'inversify';
import { ScopeListener } from '@sardonyxwt/state-store';
import {
  LocalizationScope,
  LocalizationScopeAddLocalizationActionProps,
  LocalizationScopeAddons, LocalizationScopeState,
  Translator
} from '@src/scope/localization.scope';
import { LiguiTypes } from '@src/types';
import { LocalizationLoader } from '@src/loader/localization.loader';

export interface LocalizationService extends LocalizationScopeAddons {
  loadLocalizations(keys: string[]): Promise<Translator>;
}

@injectable()
export class LocalizationServiceImpl implements LocalizationService {

  constructor(@inject(LiguiTypes.LOCALIZATION_LOADER) private loader: LocalizationLoader,
              @inject(LiguiTypes.LOCALIZATION_SCOPE) private scope: LocalizationScope) {}

  get currentLocale () {
    return this.scope.currentLocale
  }
  get currentLocalization () {
    return this.scope.currentLocalization
  }
  get defaultLocale () {
    return this.scope.defaultLocale
  }
  get locales () {
    return this.scope.locales
  }
  get localizations () {
    return this.scope.localizations
  }

  addLocalization(props: LocalizationScopeAddLocalizationActionProps) {
    this.scope.addLocalization(props);
  }

  changeLocale(locale: string) {
    this.scope.changeLocale(locale);
  }

  isLocalizationsLoaded(keys: string[]) {
    return this.scope.isLocalizationsLoaded(keys);
  }

  onAddLocalization(listener: ScopeListener<LocalizationScopeState>) {
    return this.scope.onAddLocalization(listener);
  }

  onChangeLocale(listener: ScopeListener<LocalizationScopeState>) {
    return this.scope.onChangeLocale(listener);
  }

  translate(path: string) {
    return this.scope.translate(path);
  }

  loadLocalizations(keys: string[]) {
    return this.loader(keys);
  }

}
