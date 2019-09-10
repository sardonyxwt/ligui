import { Scope, ScopeListener, ScopeListenerUnsubscribeCallback, ScopeMacroType, Store } from '@sardonyxwt/state-store';
import { copyArray, saveToArray } from '@sardonyxwt/utils/object';

export const INTERNATIONALIZATION_SCOPE_NAME = 'internationalization';
export const INTERNATIONALIZATION_SCOPE_SET_LOCALE_ACTION = 'setLocale';
export const INTERNATIONALIZATION_SCOPE_SET_TRANSLATE_UNIT_ACTION = 'setTranslateUnit';

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

export interface InternationalizationScopeState {
    readonly locales: string[];
    readonly defaultLocale: string;
    readonly currentLocale: string;
    readonly translateUnits: TranslateUnit[];
}

export interface InternationalizationScopeExtensions extends InternationalizationScopeState {
    setLocale(locale: string): void;

    setTranslateUnit(translateUnit: TranslateUnit): void;

    getTranslateUnitData(id: TranslateUnitId): TranslateUnitData;

    isTranslateUnitLoaded(id: TranslateUnitId): boolean;

    onSetLocale(listener: ScopeListener<InternationalizationScopeState>): ScopeListenerUnsubscribeCallback;

    onSetTranslateUnit(listener: ScopeListener<InternationalizationScopeState>): ScopeListenerUnsubscribeCallback;
}

export interface InternationalizationScope extends Scope<InternationalizationScopeState>,
    InternationalizationScopeExtensions {
}

function checkLocale(locales: string[], locale: string) {
    const isLocalNotAvailable = !locales.find(it => it === locale);

    if (isLocalNotAvailable) {
        throw new Error('Locale not present in locales.');
    }
}

export const translateUnitIdComparator = (id1: TranslateUnitId, id2: TranslateUnitId) =>
    id1.key === id2.key && id1.context === id2.context && id1.locale === id2.locale;

const defaultInternationalizationScopeInitState: InternationalizationScopeState = {
    currentLocale: 'en',
    defaultLocale: 'en',
    locales: ['en'],
    translateUnits: []
};

export function createInternationalizationScope(store: Store, initState = defaultInternationalizationScopeInitState) {
    const {locales, defaultLocale, currentLocale} = initState;

    checkLocale(locales, defaultLocale);
    checkLocale(locales, currentLocale);

    const internationalizationScope = store.createScope<InternationalizationScopeState>({
        name: INTERNATIONALIZATION_SCOPE_NAME,
        initState,
        isSubscribedMacroAutoCreateEnabled: true
    }) as InternationalizationScope;

    internationalizationScope.registerAction(INTERNATIONALIZATION_SCOPE_SET_LOCALE_ACTION, (state, locale: string) => {
        checkLocale(state.locales, locale);
        return {...state, currentLocale: locale};
    });

    internationalizationScope.registerAction(INTERNATIONALIZATION_SCOPE_SET_TRANSLATE_UNIT_ACTION, (
        state,
        translateUnit: TranslateUnit
    ) => {
        checkLocale(state.locales, translateUnit.id.locale);

        const translateUnits = copyArray(state.translateUnits);
        saveToArray(translateUnits, translateUnit, it => translateUnitIdComparator(translateUnit.id, it.id));

        return {...state, translateUnits};
    });

    internationalizationScope.registerMacro('locales', state => state.locales, ScopeMacroType.GETTER);
    internationalizationScope.registerMacro('defaultLocale', state => state.defaultLocale, ScopeMacroType.GETTER);
    internationalizationScope.registerMacro('currentLocale', state => state.currentLocale, ScopeMacroType.GETTER);
    internationalizationScope.registerMacro('translateUnits', state => state.translateUnits, ScopeMacroType.GETTER);
    internationalizationScope.registerMacro('getTranslateUnitData', (state, id: TranslateUnitId): TranslateUnitData => {
        const translateUnit = state.translateUnits.find(it => translateUnitIdComparator(id, it.id));
        return !!translateUnit ? translateUnit.data : undefined;
    });
    internationalizationScope.registerMacro('isTranslateUnitLoaded', (state, id: TranslateUnitId): boolean => {
        return typeof internationalizationScope.getTranslateUnitData(id) !== 'undefined';
    });

    internationalizationScope.lock();

    return internationalizationScope;
}
