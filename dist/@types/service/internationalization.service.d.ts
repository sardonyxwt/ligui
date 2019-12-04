import { ScopeListener, ScopeListenerUnsubscribeCallback } from '@sardonyxwt/state-store';
import { InternationalizationScope, InternationalizationScopeExtensions, InternationalizationScopeState, TranslateUnit, TranslateUnitData, TranslateUnitId } from '../scope/internationalization.scope';
export declare type Translator = <T = string>(key: string, defaultValue?: T) => T;
export interface TranslateUnitDataLoader {
    readonly context?: string;
    readonly loader: (key: string, locale: string) => Promise<TranslateUnitData>;
}
export interface TranslateUnitDataPromise {
    readonly id: TranslateUnitId;
    readonly promise: Promise<any>;
}
export interface InternationalizationService extends InternationalizationScopeExtensions {
    getTranslator(context: string, locale?: string): Translator;
    registerTranslateUnitDataLoader<T>(loader: TranslateUnitDataLoader): void;
    loadTranslateUnitData(id: TranslateUnitId): Promise<TranslateUnitData>;
}
export declare class InternationalizationServiceImpl implements InternationalizationService {
    protected _scope: InternationalizationScope;
    protected _translateUnitLoaders: TranslateUnitDataLoader[];
    private _translateUnitPromises;
    constructor(_scope: InternationalizationScope, _translateUnitLoaders?: TranslateUnitDataLoader[]);
    get currentLocale(): string;
    get defaultLocale(): string;
    get locales(): string[];
    get translateUnits(): TranslateUnit[];
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
//# sourceMappingURL=internationalization.service.d.ts.map