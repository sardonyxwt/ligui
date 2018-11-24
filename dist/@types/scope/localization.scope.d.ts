import { ScopeEvent, SyncScope } from '@sardonyxwt/state-store';
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
export interface LocalizationScope extends SyncScope<LocalizationScopeState> {
    readonly locales: string[];
    readonly defaultLocale: string;
    readonly currentLocale: string;
    readonly localizations: Localizations;
    readonly currentLocalization: Localization;
    readonly translator: Translator;
    readonly isConfigured: boolean;
    configure(props: LocalizationScopeConfigureActionProps): void;
    changeLocale(locale: string): void;
    addLocalization(props: LocalizationScopeAddLocalizationActionProps): void;
    isLocalizationsLoaded(keys: string[]): boolean;
    onConfigure(e: ScopeEvent<LocalizationScopeState>): any;
    onChangeLocale(e: ScopeEvent<LocalizationScopeState>): any;
    onAddLocalization(e: ScopeEvent<LocalizationScopeState>): any;
}
export declare const localizationScope: LocalizationScope;
