import { ScopeListener, ScopeMacroType, Scope, Store, ScopeListenerUnsubscribeCallback } from '@sardonyxwt/state-store';

export const LOCALIZATION_SCOPE_NAME = 'localization';
export const LOCALIZATION_SCOPE_CHANGE_LOCALE_ACTION = 'changeLocale';
export const LOCALIZATION_SCOPE_ADD_LOCALIZATION_ACTION = 'addLocalization';

export interface Localization {
  [key: string]: Localization
}

export interface Localizations {
  [locale: string]: Localization
}

export interface LocalizationScopeState {
  readonly locales: string[];
  readonly defaultLocale: string;
  readonly currentLocale: string;
  readonly localizations: Localizations
}

export interface LocalizationScopeAddLocalizationActionProps {
  key: string;
  locale: string;
  localization: Localization;
}

export interface LocalizationScopeAddons extends LocalizationScopeState {
  readonly currentLocalization: Localization;
  changeLocale(locale: string): void;
  addLocalization(props: LocalizationScopeAddLocalizationActionProps): void;
  isLocalizationLoaded(key: string): boolean;
  onChangeLocale(listener: ScopeListener<LocalizationScopeState>): ScopeListenerUnsubscribeCallback;
  onAddLocalization(listener: ScopeListener<LocalizationScopeState>): ScopeListenerUnsubscribeCallback;
}

export interface LocalizationScope extends Scope<LocalizationScopeState>, LocalizationScopeAddons {}

export interface LocalizationScopeOptions {
  initState: LocalizationScopeState;
}

function checkLocale(locales, locale) {
  const isLocalNotAvailable = !locales.find(it => it === locale);

  if (isLocalNotAvailable) {
    throw new Error('Locale not present in locales.');
  }
}

export function createLocalizationScope (store: Store, {initState}: LocalizationScopeOptions) {
  const {locales, defaultLocale, currentLocale} = initState;

  checkLocale(locales, defaultLocale);
  checkLocale(locales, currentLocale);

  const localizationScope = store.createScope<LocalizationScopeState>({
    name: LOCALIZATION_SCOPE_NAME,
    initState,
    isSubscribeMacroAutoCreateEnable: true
  }) as LocalizationScope;

  localizationScope.registerAction(LOCALIZATION_SCOPE_CHANGE_LOCALE_ACTION, (state, locale: string) => {
    checkLocale(state.locales, locale);
    return {...state, currentLocale: locale};
  });

  localizationScope.registerAction(LOCALIZATION_SCOPE_ADD_LOCALIZATION_ACTION, (state, {
    key, locale, localization
  }: LocalizationScopeAddLocalizationActionProps) => {
    checkLocale(state.locales, locale);

    const localizations = {
      ...state.localizations,
      [locale]: {
        ...state.localizations[locale],
        [key]: localization
      }
    };

    return {...state, localizations};
  });

  localizationScope.registerMacro('locales', state => state.locales, ScopeMacroType.GETTER);
  localizationScope.registerMacro('defaultLocale', state => state.defaultLocale, ScopeMacroType.GETTER);
  localizationScope.registerMacro('currentLocale', state => state.currentLocale, ScopeMacroType.GETTER);
  localizationScope.registerMacro('localizations', state => state.localizations, ScopeMacroType.GETTER);
  localizationScope.registerMacro('currentLocalization', state => {
    const {localizations, currentLocale} = state;

    return localizations[currentLocale];
  }, ScopeMacroType.GETTER);
  localizationScope.registerMacro('isLocalizationLoaded', (state, key: string) => {
    const {currentLocale, localizations} = state;

    if (!localizations[currentLocale]) {
      return false;
    }

    return !!localizations[currentLocale][key];
  });

  localizationScope.lock();

  return localizationScope;
}
