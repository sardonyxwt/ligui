import { localizationScope, LocalizationScopeAddons } from '../scope/localization.scope';
import { LLoader, localizationLoader, LocalizationLoader } from '../loader/localization.loader';

export interface LocalizationService extends LocalizationScopeAddons, LocalizationLoader {}

class LocalizationServiceImpl implements LocalizationService {

  addLocalization = localizationScope.addLocalization;
  changeLocale = localizationScope.changeLocale;
  configure = localizationScope.configure;
  isLocalizationsLoaded = localizationScope.isLocalizationsLoaded;
  onAddLocalization = localizationScope.onAddLocalization;
  onChangeLocale = localizationScope.onChangeLocale;
  onConfigure = localizationScope.onConfigure;
  loadLocalizations = localizationLoader.loadLocalizations;

  get currentLocale() {
    return localizationScope.currentLocale;
  }

  get currentLocalization() {
    return localizationScope.currentLocalization;
  }

  get defaultLocale() {
    return localizationScope.defaultLocale;
  }

  get isConfigured() {
    return localizationScope.isConfigured;
  }

  get locales() {
    return localizationScope.locales;
  }

  get localizations() {
    return localizationScope.localizations;
  }

  get translator() {
    return localizationScope.translator;
  }

  get loader() {
    return localizationLoader.loader;
  }

  set loader(loader: LLoader) {
    localizationLoader.loader = loader;
  }

}

export const localizationService = new LocalizationServiceImpl() as LocalizationService;
