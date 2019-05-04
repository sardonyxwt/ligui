import { ScopeListener } from '@sardonyxwt/state-store';
import { LocalizationScope, LocalizationScopeAddLocalizationActionProps, LocalizationScopeAddons, LocalizationScopeState, Translator } from '../scope/localization.scope';
import { LocalizationLoader } from '../loader/localization.loader';
export interface LocalizationService extends LocalizationScopeAddons {
    loadLocalizations(keys: string[]): Promise<Translator>;
}
export declare class LocalizationServiceImpl implements LocalizationService {
    private loader;
    private scope;
    constructor(loader: LocalizationLoader, scope: LocalizationScope);
    readonly currentLocale: string;
    readonly currentLocalization: import("../scope/localization.scope").Localization;
    readonly defaultLocale: string;
    readonly locales: string[];
    readonly localizations: import("../scope/localization.scope").Localizations;
    addLocalization(props: LocalizationScopeAddLocalizationActionProps): void;
    changeLocale(locale: string): void;
    isLocalizationsLoaded(keys: string[]): boolean;
    onAddLocalization(listener: ScopeListener<LocalizationScopeState>): import("@sardonyxwt/state-store").ScopeListenerUnsubscribeCallback;
    onChangeLocale(listener: ScopeListener<LocalizationScopeState>): import("@sardonyxwt/state-store").ScopeListenerUnsubscribeCallback;
    translate(path: string): string;
    loadLocalizations(keys: string[]): Promise<Translator>;
}
