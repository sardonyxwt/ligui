import { ScopeListener, Scope, Store, ScopeListenerUnsubscribeCallback } from '@sardonyxwt/state-store';
export declare const INTERNATIONALIZATION_SCOPE_NAME = "internationalization";
export declare const INTERNATIONALIZATION_SCOPE_SET_LOCALE_ACTION = "setLocale";
export declare const INTERNATIONALIZATION_SCOPE_SET_TRANSLATE_UNIT_ACTION = "setTranslateUnit";
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
export interface InternationalizationScopeAddons extends InternationalizationScopeState {
    setLocale(locale: string): void;
    setTranslateUnit(translateUnit: TranslateUnit): void;
    getTranslateUnitData(id: TranslateUnitId): TranslateUnitData;
    isTranslateUnitLoaded(id: TranslateUnitId): boolean;
    onSetLocale(listener: ScopeListener<InternationalizationScopeState>): ScopeListenerUnsubscribeCallback;
    onSetTranslateUnit(listener: ScopeListener<InternationalizationScopeState>): ScopeListenerUnsubscribeCallback;
}
export interface InternationalizationScope extends Scope<InternationalizationScopeState>, InternationalizationScopeAddons {
}
export interface InternationalizationScopeOptions {
    initState: InternationalizationScopeState;
}
export declare const translateUnitIdComparator: (id1: TranslateUnitId, id2: TranslateUnitId) => boolean;
export declare function createInternationalizationScope(store: Store, { initState }: InternationalizationScopeOptions): InternationalizationScope;
