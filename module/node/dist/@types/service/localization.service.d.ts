import { ScopeListener } from '@sardonyxwt/state-store';
import { Localization, LocalizationScope, LocalizationScopeAddLocalizationActionProps, LocalizationScopeAddons, LocalizationScopeState } from '../scope/localization.scope';
export declare type Translator = (key: string) => string;
export declare type LocalizationLoader = (locale: string, id: string, cb: (localization: Localization) => void) => void;
export interface LocalizationService extends LocalizationScopeAddons {
    translator: Translator;
    loadLocalization(key: string): Promise<Localization>;
}
export declare class LocalizationServiceImpl implements LocalizationService {
    private _loader;
    private _scope;
    private _localizationPromises;
    private _translator;
    constructor(_loader: LocalizationLoader, _scope: LocalizationScope);
    readonly currentLocale: string;
    readonly currentLocalization: Localization;
    readonly defaultLocale: string;
    readonly locales: string[];
    readonly localizations: import("../scope/localization.scope").Localizations;
    readonly translator: Translator;
    addLocalization(props: LocalizationScopeAddLocalizationActionProps): void;
    changeLocale(locale: string): void;
    isLocalizationLoaded(key: string): boolean;
    onAddLocalization(listener: ScopeListener<LocalizationScopeState>): import("@sardonyxwt/state-store").ScopeListenerUnsubscribeCallback;
    onChangeLocale(listener: ScopeListener<LocalizationScopeState>): import("@sardonyxwt/state-store").ScopeListenerUnsubscribeCallback;
    loadLocalization(key: string): Promise<Localization>;
}
