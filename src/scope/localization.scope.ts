import { createSyncScope, ScopeEvent, ScopeMacroType, SyncScope } from '@sardonyxwt/state-store';

export const LOCALIZATION_SCOPE_NAME = 'localization';
export const LOCALIZATION_SCOPE_CONFIGURE_ACTION = 'configure';
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

export interface LocalizationScopeConfigureActionProps extends LocalizationScopeState {}
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
  readonly isConfigured: boolean
  translate(path: string): string;
  configure(props: LocalizationScopeConfigureActionProps): void;
  changeLocale(locale: string): void;
  addLocalization(props: LocalizationScopeAddLocalizationActionProps): void;
  isLocalizationsLoaded(keys: string[]): boolean;
  onConfigure(e: ScopeEvent<LocalizationScopeState>);
  onChangeLocale(e: ScopeEvent<LocalizationScopeState>);
  onAddLocalization(e: ScopeEvent<LocalizationScopeState>);
}

export interface LocalizationScope extends SyncScope<LocalizationScopeState>, LocalizationScopeAddons {}

function checkLocale(locales, locale) {
  const isLocalNotAvailable = !locales.find(it => it === locale);

  if (isLocalNotAvailable) {
    throw new Error('Locale not present in locales.');
  }
}

const localizationScope = createSyncScope<LocalizationScopeState>({
  name: LOCALIZATION_SCOPE_NAME,
  initState: null,
  isSubscribeMacroAutoCreateEnable: true
}) as LocalizationScope;

localizationScope.registerAction(LOCALIZATION_SCOPE_CONFIGURE_ACTION, (state, {
  locales, defaultLocale, currentLocale, localizations
}: LocalizationScopeConfigureActionProps) => {
  if (state) {
    throw new Error('Configure action can be call only once.');
  }

  checkLocale(locales, defaultLocale);
  checkLocale(locales, currentLocale);

  if (!localizations) {
    throw new Error('Localizations can not be null.');
  }

  return {locales, defaultLocale, currentLocale, localizations};
});

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
  if (!state) {
    return null;
  }

  const {currentLocale, localizations} = state;

  let result = localizations[currentLocale];
  const pathParts = path.split('.');

  for (let i = 0; i < pathParts.length; i++) {
    result = result[pathParts[i]];
    if (!result) {
      break;
    }
  }

  return result;
});
localizationScope.registerMacro('isConfigured', state => !!state, ScopeMacroType.GETTER);

localizationScope.lock();

export {
  localizationScope
}
