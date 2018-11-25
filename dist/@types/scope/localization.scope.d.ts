import { ScopeListener, SyncScope } from '@sardonyxwt/state-store';
export declare const LOCALIZATION_SCOPE_NAME = "localization";
export declare const LOCALIZATION_SCOPE_CONFIGURE_ACTION = "configure";
export declare const LOCALIZATION_SCOPE_CHANGE_LOCALE_ACTION = "changeLocale";
export declare const LOCALIZATION_SCOPE_ADD_LOCALIZATION_ACTION = "addLocalization";
export declare type Translator = (key: string) => string;
export interface Localization {
    [key: string]: Localization;
}
export interface Localizations {
    [locale: string]: Localization;
}
export interface LocalizationScopeState {
    locales: string[];
    defaultLocale: string;
    currentLocale: string;
    localizations: Localizations;
}
export interface LocalizationScopeConfigureActionProps extends LocalizationScopeState {
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
    readonly isConfigured: boolean;
    translate(path: string): string;
    configure(props: LocalizationScopeConfigureActionProps): void;
    changeLocale(locale: string): void;
    addLocalization(props: LocalizationScopeAddLocalizationActionProps): void;
    isLocalizationsLoaded(keys: string[]): boolean;
    onConfigure(listener: ScopeListener<LocalizationScopeState>): string;
    onChangeLocale(listener: ScopeListener<LocalizationScopeState>): string;
    onAddLocalization(listener: ScopeListener<LocalizationScopeState>): string;
    unsubscribe(id: string): boolean;
}
export interface LocalizationScope extends SyncScope<LocalizationScopeState>, LocalizationScopeAddons {
}
declare const localizationScope: LocalizationScope;
export { localizationScope };
