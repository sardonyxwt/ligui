import { ScopeListener, ScopeMacroType, Scope, Store, ScopeListenerUnsubscribeCallback } from '@sardonyxwt/state-store';
import { copyArray, saveToArray } from '../extension/util.extension';

export const LOCALIZATION_SCOPE_NAME = 'localization';
export const LOCALIZATION_SCOPE_SET_LOCALE_ACTION = 'setLocale';
export const LOCALIZATION_SCOPE_SET_LOCALIZATION_ACTION = 'setLocalization';

export interface LocalizationIdentifier {
  key: string;
  locale: string;
  context: string;
}

export interface LocalizationData {
  [key: string]: string | number | boolean | LocalizationData | LocalizationData[];
}

export interface Localization extends LocalizationIdentifier {
  data: LocalizationData;
}

export interface LocalizationScopeState {
  readonly locales: string[];
  readonly defaultLocale: string;
  readonly currentLocale: string;
  readonly localizations: Localization[];
}

export interface LocalizationScopeAddons extends LocalizationScopeState {
  setLocale(locale: string): void;
  setLocalization(localization: Localization): void;
  getLocalizationData(id: LocalizationIdentifier): LocalizationData;
  isLocaleAvailable(locale: string): boolean;
  isLocalizationLoaded(id: LocalizationIdentifier): boolean;
  onSetLocale(listener: ScopeListener<LocalizationScopeState>): ScopeListenerUnsubscribeCallback;
  onSetLocalization(listener: ScopeListener<LocalizationScopeState>): ScopeListenerUnsubscribeCallback;
}

export interface LocalizationScope extends Scope<LocalizationScopeState>, LocalizationScopeAddons {}

export interface LocalizationScopeOptions {
  initState: LocalizationScopeState;
}

function checkLocale(locales: string[], locale: string) {
  const isLocalNotAvailable = !locales.find(it => it === locale);

  if (isLocalNotAvailable) {
    throw new Error('Locale not present in locales.');
  }
}

export const localizationIdComparator = (id1: LocalizationIdentifier) => (id2: LocalizationIdentifier) =>
  id1.key === id2.key && id1.context === id2.context && id1.locale === id2.locale;

export function createLocalizationScope (store: Store, {initState}: LocalizationScopeOptions) {
  const {locales, defaultLocale, currentLocale} = initState;

  checkLocale(locales, defaultLocale);
  checkLocale(locales, currentLocale);

  const localizationScope = store.createScope<LocalizationScopeState>({
    name: LOCALIZATION_SCOPE_NAME,
    initState,
    isSubscribeMacroAutoCreateEnable: true
  }) as LocalizationScope;

  localizationScope.registerAction(LOCALIZATION_SCOPE_SET_LOCALE_ACTION, (state, locale: string) => {
    checkLocale(state.locales, locale);
    return {...state, currentLocale: locale};
  });

  localizationScope.registerAction(LOCALIZATION_SCOPE_SET_LOCALIZATION_ACTION, (state, localization: Localization) => {
    checkLocale(state.locales, localization.locale);

    const localizations = copyArray(state.localizations);
    saveToArray(localizations, localization, localizationIdComparator(localization));

    return {...state, localizations};
  });

  localizationScope.registerMacro('locales', state => state.locales, ScopeMacroType.GETTER);
  localizationScope.registerMacro('defaultLocale', state => state.defaultLocale, ScopeMacroType.GETTER);
  localizationScope.registerMacro('currentLocale', state => state.currentLocale, ScopeMacroType.GETTER);
  localizationScope.registerMacro('localizations', state => state.localizations, ScopeMacroType.GETTER);
  localizationScope.registerMacro('getLocalizationData', (state, id: LocalizationIdentifier): LocalizationData => {
    const localization = state.localizations.find(localizationIdComparator(id));
    return !!localization ? localization.data : undefined;
  });
  localizationScope.registerMacro('isLocalizationLoaded', (state, id: LocalizationIdentifier): boolean => {
    return !(localizationScope.getLocalizationData(id) === undefined);
  });

  localizationScope.lock();

  return localizationScope;
}
