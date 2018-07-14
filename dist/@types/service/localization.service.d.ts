import { Scope } from '@sardonyxwt/state-store';
export declare type Translator = (key: string) => string;
export interface Localization {
    [key: string]: string;
}
export interface LocalizationServiceState {
    locales: string[];
    defaultLocale: string;
    currentLocale: string;
    localizations: {
        [key: string]: Localization;
    };
}
export interface LocalizationServiceConfig {
    loader: (locale: string, id: string) => Promise<Localization>;
    initState: LocalizationServiceState;
}
export interface LocalizationService {
    changeLocale(locale: string): Promise<LocalizationServiceState>;
    getScope(): Scope<LocalizationServiceState>;
    getLocales(): string[];
    getDefaultLocale(): string;
    getCurrentLocale(): string;
    subscribe(id: string | string[], subscriber: (t: Translator) => void): void;
    configure(config: LocalizationServiceConfig): void;
}
export declare const LOCALIZATION_SCOPE_NAME = "LOCALIZATION_SCOPE";
export declare const LOCALIZATION_SCOPE_ACTION_ADD = "ADD_LOCALIZATION";
export declare const LOCALIZATION_SCOPE_ACTION_CHANGE = "CHANGE_LOCALIZATION";
export declare const localizationService: LocalizationService;
