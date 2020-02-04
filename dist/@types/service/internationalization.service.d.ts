import { InternationalizationStore, TranslateUnit, TranslateUnitData, TranslateUnitId } from '../store/internationalization.store';
export declare type Translator = <T = string>(key: string, defaultValue?: T) => T;
export interface TranslateUnitLoader {
    readonly context?: string;
    readonly loader: (key: string, locale: string) => Promise<TranslateUnitData>;
}
export interface TranslateUnitPromise {
    readonly id: TranslateUnitId;
    readonly promise: Promise<TranslateUnit>;
}
export interface InternationalizationService {
    registerTranslateUnitLoader(loader: TranslateUnitLoader): void;
    loadTranslateUnit(id: TranslateUnitId): Promise<TranslateUnit>;
    getTranslator(context: string, locale?: string): Translator;
}
export declare class InternationalizationServiceImpl implements InternationalizationService {
    protected _store: InternationalizationStore;
    protected _translateUnitLoaders: TranslateUnitLoader[];
    private _translateUnitPromises;
    constructor(_store: InternationalizationStore, _translateUnitLoaders?: TranslateUnitLoader[]);
    registerTranslateUnitLoader(loader: TranslateUnitLoader): void;
    loadTranslateUnit(id: TranslateUnitId): Promise<TranslateUnit>;
    getTranslator(context: string, locale?: string): Translator;
}
//# sourceMappingURL=internationalization.service.d.ts.map