import { Observable } from 'rxjs/Observable';
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
    getTranslator(ids: string[]): Observable<Translator>;
}
export interface ILocalizationProviderConfig {
    loader: (id: string) => Promise<Localization>;
    locales: string[];
    defaultLocale: string;
    currentLocale: string;
}
export declare class LocalizationProvider extends Provider<ILocalizationService, ILocalizationProviderConfig> {
    private static instance;
    private constructor();
    static readonly INSTANCE: LocalizationProvider;
    createService(config: ILocalizationProviderConfig): ILocalizationService;
}
