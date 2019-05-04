import { ScopeListener, ScopeMacroType, Scope, Store, ScopeListenerUnsubscribeCallback } from '@sardonyxwt/state-store';

export const LOCALIZATION_SCOPE_NAME = 'localization';
export const LOCALIZATION_SCOPE_CHANGE_LOCALE_ACTION = 'changeLocale';
export const LOCALIZATION_SCOPE_ADD_LOCALIZATION_ACTION = 'addLocalization';

export type Translator = (key: string) => string;

export interface Localization {
  [key: string]: Localization
}

export interface Localizations {
  [locale: string]: Localization
}

export interface LocalizationScopeState {
  locales: string[];
  defaultLocale: string;
  currentLocale: string;
  localizations: Localizations
}

export interface LocalizationScopeAddLocalizationActionProps {
  key: string;
  locale: string;
  localization: Localization;
}

export interface LocalizationScopeAddons {
  readonly locales: string[];
  readonly defaultLocale: string;
  readonly currentLocale: string;
  readonly localizations: Localizations;
  readonly currentLocalization: Localization;
  translate(path: string): string;
  changeLocale(locale: string): void;
  addLocalization(props: LocalizationScopeAddLocalizationActionProps): void;
  isLocalizationsLoaded(keys: string[]): boolean;
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

  localizationScope.registerMacro('locales', state => state ? state.locales : null, ScopeMacroType.GETTER);
  localizationScope.registerMacro('defaultLocale', state => state ? state.defaultLocale : null, ScopeMacroType.GETTER);
  localizationScope.registerMacro('currentLocale', state => state ? state.currentLocale : null, ScopeMacroType.GETTER);
  localizationScope.registerMacro('localizations', state => state ? state.localizations : null, ScopeMacroType.GETTER);
  localizationScope.registerMacro('currentLocalization', state => {
    if (!state) {
      return null;
    }

    const {localizations, currentLocale} = state;

    return localizations[currentLocale];
  }, ScopeMacroType.GETTER);
  localizationScope.registerMacro('isLocalizationsLoaded', (state, keys: string[]) => {
    if (!state) {
      return false;
    }

    const {currentLocale, localizations} = state;

    if (!localizations[currentLocale]) {
      return false;
    }

    keys.forEach(key => {
      if (!localizations[currentLocale][key]) {
        return false;
      }
    });

    return true;
  });
  localizationScope.registerMacro('translate', (state, path: string) => {
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

    return result;
  });

  localizationScope.lock();

  return localizationScope;
}
