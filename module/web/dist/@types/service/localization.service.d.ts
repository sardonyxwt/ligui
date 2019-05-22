import { ScopeListener } from '@sardonyxwt/state-store';
import { Localization, LocalizationScope, LocalizationScopeAddLocalizationActionProps, LocalizationScopeAddons, LocalizationScopeState, Translator } from '../scope/localization.scope';
export declare type LocalizationLoader = (locale: string, id: string) => Localization | Promise<Localization>;
export interface LocalizationService extends LocalizationScopeAddons {
    loadLocalizations(keys: string[]): Promise<Translator>;
}
export declare class LocalizationServiceImpl implements LocalizationService {
    private _loader;
    private _scope;
    private _localizationPromises;
    constructor(_loader: LocalizationLoader, _scope: LocalizationScope);
    readonly currentLocale: string;
    readonly currentLocalization: Localization;
    readonly defaultLocale: string;
    readonly locales: string[];
    readonly localizations: import("../scope/localization.scope").Localizations;
    addLocalization(props: LocalizationScopeAddLocalizationActionProps): void;
    changeLocale(locale: string): void;
    isLocalizationsLoaded(keys: string[]): boolean;
    onAddLocalization(listener: ScopeListener<LocalizationScopeState>): import("@sardonyxwt/state-store").ScopeListenerUnsubscribeCallback;
    onChangeLocale(listener: ScopeListener<LocalizationScopeState>): import("@sardonyxwt/state-store").ScopeListenerUnsubscribeCallback;
    translate(path: string): string;
    loadLocalizations(keys: string[]): Promise<(path: string) => string>;
}
