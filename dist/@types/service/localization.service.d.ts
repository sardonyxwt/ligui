import { Scope } from '@sardonyxwt/state-store';
export declare type Translator = (key: string) => string;
export interface AddLocalizationActionProps {
    localizationId: string;
    localization: Localization;
}
export interface Localization {
    [key: string]: string;
}
export interface ILocalizationProviderState {
    locales: string[];
    defaultLocale: string;
    currentLocale: string;
    localizations: {
        [key: string]: Localization;
    };
}
export interface ILocalizationProviderConfig {
    loader: (locale: string, id: string) => Promise<Localization>;
    initState: ILocalizationProviderState;
    defaultLoadingMessage?: string;
}
export declare class LocalizationService {
    static readonly SCOPE_NAME: string;
    static readonly ADD_LOCALIZATION_ACTION: string;
    static readonly CHANGE_LOCALIZATION_ACTION: string;
    private scope;
    private isConfigured;
    private defaultTranslator;
    private localizationCache;
    private static instance;
    private constructor();
    static readonly INSTANCE: LocalizationService;
    changeLocale(locale: string): Promise<ILocalizationProviderState>;
    getScope(): Scope<ILocalizationProviderState>;
    getLocales(): string[];
    getDefaultLocale(): string;
    getCurrentLocale(): string;
    subscribe(id: string, subscriber: (t: Translator) => void): void;
    configure(config: ILocalizationProviderConfig): void;
}
