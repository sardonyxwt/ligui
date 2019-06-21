import { ScopeListener, ScopeMacroType, Scope, Store, ScopeListenerUnsubscribeCallback } from '@sardonyxwt/state-store';
import { copyArray, saveToArray } from '../extension/util.extension';

export const INTERNALIZATION_SCOPE_NAME = 'internalization';
export const INTERNALIZATION_SCOPE_SET_LOCALE_ACTION = 'setLocale';
export const INTERNALIZATION_SCOPE_SET_TRANSLATE_UNIT_ACTION = 'setTranslateUnit';

export interface TranslateUnitId {
  readonly key: string;
  readonly locale: string;
  readonly context?: string;
}

export interface TranslateUnitData {
  readonly [key: string]: string | number | boolean | TranslateUnitData | TranslateUnitData[];
}

export interface TranslateUnit {
  readonly id: TranslateUnitId;
  readonly data: TranslateUnitData;
}

export interface InternalizationScopeState {
  readonly locales: string[];
  readonly defaultLocale: string;
  readonly currentLocale: string;
  readonly translateUnits: TranslateUnit[];
}

export interface InternalizationScopeAddons extends InternalizationScopeState {
  setLocale(locale: string): void;
  setTranslateUnit(translateUnit: TranslateUnit): void;
  getTranslateUnitData(id: TranslateUnitId): TranslateUnitData;
  isTranslateUnitLoaded(id: TranslateUnitId): boolean;
  onSetLocale(listener: ScopeListener<InternalizationScopeState>): ScopeListenerUnsubscribeCallback;
  onSetTranslateUnit(listener: ScopeListener<InternalizationScopeState>): ScopeListenerUnsubscribeCallback;
}

export interface InternalizationScope extends Scope<InternalizationScopeState>, InternalizationScopeAddons {}

export interface InternalizationScopeOptions {
  initState: InternalizationScopeState;
}

function checkLocale(locales: string[], locale: string) {
  const isLocalNotAvailable = !locales.find(it => it === locale);

  if (isLocalNotAvailable) {
    throw new Error('Locale not present in locales.');
  }
}

export const translateUnitIdComparator = (id1: TranslateUnitId, id2: TranslateUnitId) =>
  id1.key === id2.key && id1.context === id2.context && id1.locale === id2.locale;

export function createInternalizationScope (store: Store, {initState}: InternalizationScopeOptions) {
  const {locales, defaultLocale, currentLocale} = initState;

  checkLocale(locales, defaultLocale);
  checkLocale(locales, currentLocale);

  const localizationScope = store.createScope<InternalizationScopeState>({
    name: INTERNALIZATION_SCOPE_NAME,
    initState,
    isSubscribeMacroAutoCreateEnable: true
  }) as InternalizationScope;

  localizationScope.registerAction(INTERNALIZATION_SCOPE_SET_LOCALE_ACTION, (state, locale: string) => {
    checkLocale(state.locales, locale);
    return {...state, currentLocale: locale};
  });

  localizationScope.registerAction(INTERNALIZATION_SCOPE_SET_TRANSLATE_UNIT_ACTION, (state, translateUnit: TranslateUnit) => {
    checkLocale(state.locales, translateUnit.id.locale);

    const translateUnits = copyArray(state.translateUnits);
    saveToArray(translateUnits, translateUnit, it => translateUnitIdComparator(translateUnit.id, it.id));

    return {...state, translateUnits};
  });

  localizationScope.registerMacro('locales', state => state.locales, ScopeMacroType.GETTER);
  localizationScope.registerMacro('defaultLocale', state => state.defaultLocale, ScopeMacroType.GETTER);
  localizationScope.registerMacro('currentLocale', state => state.currentLocale, ScopeMacroType.GETTER);
  localizationScope.registerMacro('translateUnits', state => state.translateUnits, ScopeMacroType.GETTER);
  localizationScope.registerMacro('getTranslateUnitData', (state, id: TranslateUnitId): TranslateUnitData => {
    const translateUnit = state.translateUnits.find(it => translateUnitIdComparator(id, it.id));
    return !!translateUnit ? translateUnit.data : undefined;
  });
  localizationScope.registerMacro('isTranslateUnitLoaded', (state, id: TranslateUnitId): boolean => {
    return typeof localizationScope.getTranslateUnitData(id) === 'undefined';
  });

  localizationScope.lock();

  return localizationScope;
}
