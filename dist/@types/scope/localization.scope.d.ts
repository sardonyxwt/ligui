import { ScopeListener, Scope, Store, ScopeListenerUnsubscribeCallback } from '@sardonyxwt/state-store';
export declare const LOCALIZATION_SCOPE_NAME = "localization";
export declare const LOCALIZATION_SCOPE_SET_LOCALE_ACTION = "setLocale";
export declare const LOCALIZATION_SCOPE_SET_LOCALIZATION_ACTION = "setLocalization";
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
export interface LocalizationScope extends Scope<LocalizationScopeState>, LocalizationScopeAddons {
}
export interface LocalizationScopeOptions {
    initState: LocalizationScopeState;
}
export declare const localizationIdComparator: (id1: LocalizationIdentifier) => (id2: LocalizationIdentifier) => boolean;
export declare function createLocalizationScope(store: Store, { initState }: LocalizationScopeOptions): LocalizationScope;
