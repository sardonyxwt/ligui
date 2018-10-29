import { SyncScope } from '@sardonyxwt/state-store';
export declare type LocalizationLoader = (locale: string, id: string) => Localization | Promise<Localization>;
export declare type Translator = (key: string) => string;
export interface Localization {
    [key: string]: Localization;
}
export interface LocalizationScopeState {
    locales: string[];
    defaultLocale: string;
    currentLocale: string;
    localizations: {
        [locale: string]: Localization;
    };
}
export declare const LOCALIZATION_SCOPE_NAME = "LOCALIZATION_SCOPE";
export declare const LOCALIZATION_SCOPE_ACTION_SET = "setLocalization";
export declare const LOCALIZATION_SCOPE_ACTION_CHANGE_LOCALE = "changeLocale";
export interface LocalizationScope extends SyncScope<LocalizationScopeState> {
    [LOCALIZATION_SCOPE_ACTION_SET](props: {
        locale: string;
        id: string;
        localization: Localization;
    }): any;
    [LOCALIZATION_SCOPE_ACTION_CHANGE_LOCALE](locale: string): any;
}
export interface LocalizationServiceConfig {
    loader?: LocalizationLoader;
    initState: LocalizationScopeState;
}
export interface LocalizationService {
    readonly locales: string[];
    readonly defaultLocale: string;
    readonly currentLocale: string;
    readonly translator: Translator;
    readonly scope: LocalizationScope;
    onLocaleChange(callback: (oldLocale: string, newLocale: string) => void): void;
    changeLocale(locale: string): void;
    loadLocalizations(id: string | string[]): Promise<Translator>;
    configure(config: LocalizationServiceConfig): void;
}
export declare const localizationService: LocalizationService;
