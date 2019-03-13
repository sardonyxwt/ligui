import { localizationScope, LocalizationScopeAddons, localizationLoader, LocalizationLoader, LLoader } from '..';

export interface LocalizationService extends LocalizationScopeAddons, LocalizationLoader {}

export const localizationService: LocalizationService = Object.freeze({
  addLocalization: localizationScope.addLocalization.bind(localizationScope),
  changeLocale: localizationScope.changeLocale.bind(localizationScope),
  configure: localizationScope.configure.bind(localizationScope),
  translate: localizationScope.translate.bind(localizationScope),
  isLocalizationsLoaded: localizationScope.isLocalizationsLoaded.bind(localizationScope),
  onAddLocalization: localizationScope.onAddLocalization.bind(localizationScope),
  onChangeLocale: localizationScope.onChangeLocale.bind(localizationScope),
  onConfigure: localizationScope.onConfigure.bind(localizationScope),
  unsubscribe: localizationScope.unsubscribe.bind(localizationScope),
  loadLocalizations: localizationLoader.loadLocalizations.bind(localizationLoader),
  get currentLocale() {
    return localizationScope.currentLocale;
  },
  get currentLocalization() {
    return localizationScope.currentLocalization;
  },
  get defaultLocale() {
    return localizationScope.defaultLocale;
  },
  get isConfigured() {
    return localizationScope.isConfigured;
  },
  get locales() {
    return localizationScope.locales;
  },
  get localizations() {
    return localizationScope.localizations;
  },
  get loader() {
    return localizationLoader.loader;
  },
  set loader(loader: LLoader) {
    localizationLoader.loader = loader;
  }
});
