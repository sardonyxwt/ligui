import { Provider } from '../provider';
export declare type Translator = (key: string) => string;
export interface Localization {
    [key: string]: string;
}
export interface ILocalizationService {
    changeLocale(locale: string): void;
    getLocales(): string[];
    getDefaultLocale(): string;
    getCurrentLocale(): string;
    subscribe(ids: string[], subscriber: (t: Translator) => void): any;
}
export interface ILocalizationProviderState {
    locales: string[];
    defaultLocale: string;
    currentLocale: string;
    localizations: {
        [key: string]: {
            [key: string]: string;
        };
    };
}
export interface ILocalizationProviderConfig {
    loader: (id: string) => Promise<Localization>;
    locales: string[];
    defaultLocale: string;
    currentLocale: string;
    initState?: ILocalizationProviderState;
}
export declare class LocalizationProvider extends Provider<ILocalizationService, ILocalizationProviderConfig> {
    private static instance;
    private constructor();
    static readonly INSTANCE: LocalizationProvider;
    protected createService(config: ILocalizationProviderConfig): ILocalizationService;
}
