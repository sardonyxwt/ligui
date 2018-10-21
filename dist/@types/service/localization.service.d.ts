import { SyncScope } from '@sardonyxwt/state-store';
export declare type Translator = (key: string) => string;
export interface Localization {
    [key: string]: string;
}
export interface LocalizationServiceState {
    locales: string[];
    defaultLocale: string;
    currentLocale: string;
    localizations: {
        [locale: string]: Localization;
    };
}
export interface LocalizationServiceConfig {
    loader: (locale: string, id: string) => Promise<Localization>;
    initState: LocalizationServiceState;
}
export interface LocalizationService {
    readonly locales: string[];
    readonly defaultLocale: string;
    readonly currentLocale: string;
    readonly translator: Translator;
    readonly scope: SyncScope<LocalizationServiceState>;
    onLocaleChange(callback: (oldLocale: string, newLocale: string) => void): void;
    changeLocale(locale: string): void;
    loadLocalizations(id: string | string[]): Promise<void>;
    configure(config: LocalizationServiceConfig): void;
}
export declare const LOCALIZATION_SCOPE_NAME = "LOCALIZATION_SCOPE";
export declare const LOCALIZATION_SCOPE_ACTION_ADD = "add";
export declare const LOCALIZATION_SCOPE_ACTION_CHANGE_LOCALE = "changeLocale";
export declare const localizationService: LocalizationService;
