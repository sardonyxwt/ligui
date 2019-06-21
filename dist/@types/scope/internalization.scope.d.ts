import { ScopeListener, Scope, Store, ScopeListenerUnsubscribeCallback } from '@sardonyxwt/state-store';
export declare const INTERNALIZATION_SCOPE_NAME = "internalization";
export declare const INTERNALIZATION_SCOPE_SET_LOCALE_ACTION = "setLocale";
export declare const INTERNALIZATION_SCOPE_SET_TRANSLATE_UNIT_ACTION = "setTranslateUnit";
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
export interface InternalizationScope extends Scope<InternalizationScopeState>, InternalizationScopeAddons {
}
export interface InternalizationScopeOptions {
    initState: InternalizationScopeState;
}
export declare const translateUnitIdComparator: (id1: TranslateUnitId, id2: TranslateUnitId) => boolean;
export declare function createInternalizationScope(store: Store, { initState }: InternalizationScopeOptions): InternalizationScope;
