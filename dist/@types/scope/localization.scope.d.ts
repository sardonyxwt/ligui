import { ScopeListener, Scope, Store, ScopeListenerUnsubscribeCallback } from '@sardonyxwt/state-store';
export declare const LOCALIZATION_SCOPE_NAME = "localization";
export declare const LOCALIZATION_SCOPE_CHANGE_LOCALE_ACTION = "changeLocale";
export declare const LOCALIZATION_SCOPE_SET_LOCALIZATION_ACTION = "setLocalization";
export interface Localization {
    [key: string]: Localization;
}
export interface Localizations {
    [locale: string]: Localization;
}
export interface LocalizationScopeState {
    readonly locales: string[];
    readonly defaultLocale: string;
    readonly currentLocale: string;
    readonly localizations: Localizations;
}
export interface LocalizationScopeAddLocalizationActionProps {
    key: string;
    locale: string;
    localization: Localization;
}
export interface LocalizationScopeAddons extends LocalizationScopeState {
    readonly currentLocalization: Localization;
    changeLocale(locale: string): void;
    setLocalization(props: LocalizationScopeAddLocalizationActionProps): void;
    isLocalizationLoaded(key: string): boolean;
    onChangeLocale(listener: ScopeListener<LocalizationScopeState>): ScopeListenerUnsubscribeCallback;
    onSetLocalization(listener: ScopeListener<LocalizationScopeState>): ScopeListenerUnsubscribeCallback;
}
export interface LocalizationScope extends Scope<LocalizationScopeState>, LocalizationScopeAddons {
}
export interface LocalizationScopeOptions {
    initState: LocalizationScopeState;
}
export declare function createLocalizationScope(store: Store, { initState }: LocalizationScopeOptions): LocalizationScope;
