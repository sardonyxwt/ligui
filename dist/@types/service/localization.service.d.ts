import { ScopeListener, ScopeListenerUnsubscribeCallback } from '@sardonyxwt/state-store';
import { Localization, LocalizationData, LocalizationIdentifier, LocalizationScope, LocalizationScopeState, LocalizationScopeAddons } from '../scope/localization.scope';
export declare type Translator = (key: string) => string;
export interface LocalizationLoader {
    context: string;
    loader: (key: string, locale: string) => Promise<LocalizationData>;
}
export interface LocalizationPromise extends LocalizationIdentifier {
    promise: Promise<any>;
}
export interface LocalizationService extends LocalizationScopeAddons {
    getTranslator(context: string, locale?: string): Translator;
    registerLocalizationLoader<T>(loader: LocalizationLoader): any;
    loadLocalization(id: LocalizationIdentifier): Promise<Localization>;
}
export declare class LocalizationServiceImpl implements LocalizationService {
    protected _scope: LocalizationScope;
    protected _localizationLoaders: LocalizationLoader[];
    private _localizationPromises;
    constructor(_scope: LocalizationScope, _localizationLoaders?: LocalizationLoader[]);
    readonly currentLocale: string;
    readonly defaultLocale: string;
    readonly locales: string[];
    readonly localizations: Localization[];
    registerLocalizationLoader<T>(loader: LocalizationLoader): void;
    getLocalizationData(id: LocalizationIdentifier): LocalizationData;
    getTranslator(context: string, locale?: string): Translator;
    isLocaleAvailable(locale: string): boolean;
    isLocalizationLoaded(id: LocalizationIdentifier): boolean;
    loadLocalization(id: LocalizationIdentifier): Promise<Localization>;
    onSetLocale(listener: ScopeListener<LocalizationScopeState>): ScopeListenerUnsubscribeCallback;
    onSetLocalization(listener: ScopeListener<LocalizationScopeState>): ScopeListenerUnsubscribeCallback;
    setLocale(locale: string): void;
    setLocalization(localization: Localization): void;
}
