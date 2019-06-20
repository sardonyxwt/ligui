import { ScopeListener } from '@sardonyxwt/state-store';
import { Localization, LocalizationScope, LocalizationScopeAddLocalizationActionProps, LocalizationScopeAddons, LocalizationScopeState } from '../scope/localization.scope';
export declare type Translator = (key: string) => string;
export declare type LocalizationLoader = (locale: string, id: string, cb: (localization: Localization) => void) => void;
export interface LocalizationService extends LocalizationScopeAddons {
    translator: Translator;
    getLocalization(key: string): Localization;
    loadLocalization(key: string): Promise<Localization>;
}
export declare class LocalizationServiceImpl implements LocalizationService {
    protected _loader: LocalizationLoader;
    protected _scope: LocalizationScope;
    private _localizationPromises;
    private _translator;
    constructor(_loader: LocalizationLoader, _scope: LocalizationScope);
    readonly currentLocale: string;
    readonly currentLocalization: Localization;
    readonly defaultLocale: string;
    readonly locales: string[];
    readonly localizations: import("../scope/localization.scope").Localizations;
    readonly translator: Translator;
    setLocalization(props: LocalizationScopeAddLocalizationActionProps): void;
    getLocalization(key: string): Localization;
    changeLocale(locale: string): void;
    isLocalizationLoaded(key: string): boolean;
    onSetLocalization(listener: ScopeListener<LocalizationScopeState>): import("@sardonyxwt/state-store").ScopeListenerUnsubscribeCallback;
    onChangeLocale(listener: ScopeListener<LocalizationScopeState>): import("@sardonyxwt/state-store").ScopeListenerUnsubscribeCallback;
    loadLocalization(key: string): Promise<Localization>;
}
