import { InternationalizationStore, TranslateUnit, TranslateUnitData, TranslateUnitId } from '../store/internationalization.store';
export interface TranslatorArgs<T> {
    defaultValue?: T;
    [key: string]: any;
}
export declare type Translator = <T = string>(key: string, argsOrDefaultValue?: T | TranslatorArgs<T>) => T;
export interface TranslateUnitLoader {
    readonly context?: string;
    readonly loader: (key: string, locale: string) => TranslateUnitData | Promise<TranslateUnitData>;
}
export interface TranslateUnitPromise {
    readonly id: TranslateUnitId;
    readonly promise: Promise<TranslateUnit>;
}
export interface InternationalizationService {
    setTranslateUnitLoader(loader: TranslateUnitLoader): void;
    getTranslateUnitLoader(context?: string): TranslateUnitLoader;
    loadTranslateUnit(id: TranslateUnitId): TranslateUnit | Promise<TranslateUnit>;
    getTranslator(context: string, locale?: string): Translator;
}
export declare class InternationalizationServiceImpl implements InternationalizationService {
    protected _store: InternationalizationStore;
    protected _translateUnitLoaders: TranslateUnitLoader[];
    private _translateUnitPromises;
    constructor(_store: InternationalizationStore, _translateUnitLoaders?: TranslateUnitLoader[]);
    setTranslateUnitLoader(loader: TranslateUnitLoader): void;
    getTranslateUnitLoader(context?: string): TranslateUnitLoader;
    loadTranslateUnit(id: TranslateUnitId): TranslateUnit | Promise<TranslateUnit>;
    getTranslator(context: string, locale?: string): Translator;
}
//# sourceMappingURL=internationalization.service.d.ts.map