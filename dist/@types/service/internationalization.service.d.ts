import { ScopeListener, ScopeListenerUnsubscribeCallback } from '@sardonyxwt/state-store';
import { InternationalizationScope, InternationalizationScopeAddons, InternationalizationScopeState, TranslateUnit, TranslateUnitData, TranslateUnitId } from '../scope/internationalization.scope';
export declare type Translator = (key: string) => TranslateUnitData;
export interface TranslateUnitDataLoader {
    readonly context?: string;
    readonly loader: (key: string, locale: string) => Promise<TranslateUnitData>;
}
export interface TranslateUnitDataPromise {
    readonly id: TranslateUnitId;
    readonly promise: Promise<any>;
}
export interface InternationalizationService extends InternationalizationScopeAddons {
    getTranslator(context: string, locale?: string): Translator;
    registerTranslateUnitDataLoader<T>(loader: TranslateUnitDataLoader): void;
    loadTranslateUnitData(id: TranslateUnitId): Promise<TranslateUnitData>;
}
export declare class InternationalizationServiceImpl implements InternationalizationService {
    protected _scope: InternationalizationScope;
    protected _translateUnitLoaders: TranslateUnitDataLoader[];
    private _translateUnitPromises;
    constructor(_scope: InternationalizationScope, _translateUnitLoaders?: TranslateUnitDataLoader[]);
    readonly currentLocale: string;
    readonly defaultLocale: string;
    readonly locales: string[];
    readonly translateUnits: TranslateUnit[];
    registerTranslateUnitDataLoader<T>(loader: TranslateUnitDataLoader): void;
    setLocale(locale: string): void;
    setTranslateUnit(translateUnit: TranslateUnit): void;
    getTranslateUnitData(id: TranslateUnitId): TranslateUnitData;
    getTranslator(context: string, locale?: string): Translator;
    onSetLocale(listener: ScopeListener<InternationalizationScopeState>): ScopeListenerUnsubscribeCallback;
    onSetTranslateUnit(listener: ScopeListener<InternationalizationScopeState>): ScopeListenerUnsubscribeCallback;
    isTranslateUnitLoaded(id: TranslateUnitId): boolean;
    loadTranslateUnitData(id: TranslateUnitId): Promise<TranslateUnitData>;
}
