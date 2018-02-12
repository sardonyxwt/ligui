import { Scope } from '@sardonyxwt/state-store';
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
export declare class LocalizationService {
    static readonly SCOPE_NAME: string;
    static readonly ADD_LOCALIZATION_ACTION: string;
    static readonly CHANGE_LOCALIZATION_ACTION: string;
    private scope;
    private defaultTranslator;
    private localizationCache;
    private static instance;
    private constructor();
    static readonly INSTANCE: LocalizationService;
    changeLocale(locale: string): Promise<LocalizationProviderState>;
    getScope(): Scope<LocalizationProviderState>;
    getLocales(): string[];
    getDefaultLocale(): string;
    getCurrentLocale(): string;
    subscribe(id: string, subscriber: (t: Translator) => void): void;
    configure(config: LocalizationProviderConfig): void;
}
