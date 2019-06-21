import { ScopeListener, ScopeListenerUnsubscribeCallback } from '@sardonyxwt/state-store';
import { InternalizationScope, InternalizationScopeAddons, InternalizationScopeState, TranslateUnit, TranslateUnitData, TranslateUnitId } from '../scope/internalization.scope';
export declare type Translator = (key: string) => TranslateUnitData;
export interface TranslateUnitDataLoader {
    readonly context?: string;
    readonly loader: (key: string, locale: string) => Promise<TranslateUnitData>;
}
export interface TranslateUnitDataPromise {
    readonly id: TranslateUnitId;
    readonly promise: Promise<any>;
}
export interface InternalizationService extends InternalizationScopeAddons {
    getTranslator(context: string, locale?: string): Translator;
    registerTranslateUnitDataLoader<T>(loader: TranslateUnitDataLoader): any;
    loadTranslateUnitData(id: TranslateUnitId): Promise<TranslateUnitData>;
}
export declare class InternalizationServiceImpl implements InternalizationService {
    protected _scope: InternalizationScope;
    protected _translateUnitLoaders: TranslateUnitDataLoader[];
    private _translateUnitPromises;
    constructor(_scope: InternalizationScope, _translateUnitLoaders?: TranslateUnitDataLoader[]);
    readonly currentLocale: string;
    readonly defaultLocale: string;
    readonly locales: string[];
    readonly translateUnits: TranslateUnit[];
    registerTranslateUnitDataLoader<T>(loader: TranslateUnitDataLoader): void;
    setLocale(locale: string): void;
    setTranslateUnit(translateUnit: TranslateUnit): void;
    getTranslateUnitData(id: TranslateUnitId): TranslateUnitData;
    getTranslator(context: string, locale?: string): Translator;
    onSetLocale(listener: ScopeListener<InternalizationScopeState>): ScopeListenerUnsubscribeCallback;
    onSetTranslateUnit(listener: ScopeListener<InternalizationScopeState>): ScopeListenerUnsubscribeCallback;
    isTranslateUnitLoaded(id: TranslateUnitId): boolean;
    loadTranslateUnitData(id: TranslateUnitId): Promise<TranslateUnitData>;
}
