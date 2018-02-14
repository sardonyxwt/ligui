import { Scope } from '../';
export declare type Translator = (key: string) => string;
export interface Localization {
    [key: string]: string;
}
export interface LocalizationProviderState {
    locales: string[];
    defaultLocale: string;
    currentLocale: string;
    localizations: {
        [key: string]: Localization;
    };
}
export interface LocalizationProviderConfig {
    loader: (locale: string, id: string) => Promise<Localization>;
    initState: LocalizationProviderState;
}
export interface LocalizationService {
    changeLocale(locale: string): Promise<LocalizationProviderState>;
    getScope(): Scope<LocalizationProviderState>;
    getLocales(): string[];
    getDefaultLocale(): string;
    getCurrentLocale(): string;
    subscribe(id: string, subscriber: (t: Translator) => void): void;
    configure(config: LocalizationProviderConfig): void;
}
export declare const LOCALIZATION_SCOPE_NAME = "LOCALIZATION_SCOPE";
export declare const localizationService: LocalizationService;
