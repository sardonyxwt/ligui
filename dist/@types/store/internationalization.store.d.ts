import { Scope, Store } from '@sardonyxwt/state-store';
export interface TranslateUnitId {
    readonly key: string;
    readonly locale: string;
    readonly context?: string;
}
export declare type TranslateUnitData = Record<string, any>;
export interface TranslateUnit {
    readonly id: TranslateUnitId;
    readonly data: TranslateUnitData;
}
export interface InternationalizationStoreState {
    currentLocale: string;
    defaultLocale: string;
    readonly locales: string[];
    readonly translateUnits: TranslateUnit[];
}
export interface InternationalizationStore extends Scope<InternationalizationStoreState> {
    setLocale(locale: string): void;
    setTranslateUnits(translateUnits: TranslateUnit[]): void;
    setTranslationsForLocale(locale: string, translationObject: Record<string, TranslateUnitData>, context?: string): any;
    findTranslateUnitById(id: TranslateUnitId): TranslateUnit;
    isLocaleExist(locale: string): boolean;
    isTranslateUnitExist(id: TranslateUnitId): boolean;
}
export declare enum InternationalizationStoreActions {
    ChangeLocale = "CHANGE_LOCALE",
    UpdateTranslateUnits = "UPDATE_TRANSLATE_UNITS"
}
export declare const createInternationalizationStore: (store: Store, initState: InternationalizationStoreState) => InternationalizationStore;
export declare function isTranslateUnitsIdsEqual(translateUnitId1: TranslateUnitId, translateUnitId2: TranslateUnitId): boolean;
//# sourceMappingURL=internationalization.store.d.ts.map