export interface TranslateUnitId {
    readonly key: string;
    readonly locale: string;
    readonly context?: string;
}
export interface TranslateUnitData {
    readonly [key: string]: string | number | boolean | TranslateUnitData | TranslateUnitData[];
}
export interface TranslateUnit {
    readonly id: TranslateUnitId;
    readonly data: TranslateUnitData;
}
export interface InternationalizationStore {
    currentLocale: string;
    defaultLocale: string;
    readonly locales: string[];
    readonly translateUnits: TranslateUnit[];
    setTranslateUnit(...translateUnits: TranslateUnit[]): void;
    findTranslateUnitById(id: TranslateUnitId): TranslateUnit;
    isLocaleExist(locale: string): boolean;
    isTranslateUnitExist(id: TranslateUnitId): boolean;
    reset(): void;
}
export declare class InternationalizationStoreImpl implements InternationalizationStore {
    private _currentLocale;
    private _defaultLocale;
    readonly locales: string[];
    readonly translateUnits: TranslateUnit[];
    constructor(locales?: string[], currentLocale?: string, defaultLocale?: string, translateUnits?: TranslateUnit[]);
    setTranslateUnit(...translateUnits: TranslateUnit[]): void;
    set currentLocale(locale: string);
    set defaultLocale(locale: string);
    get currentLocale(): string;
    get defaultLocale(): string;
    findTranslateUnitById(id: TranslateUnitId): TranslateUnit;
    isLocaleExist(locale: string): boolean;
    isTranslateUnitExist(id: TranslateUnitId): boolean;
    reset(): void;
    private checkLocale;
}
export declare function isTranslateUnitsIdsEqual(translateUnitId1: TranslateUnitId, translateUnitId2: TranslateUnitId): boolean;
//# sourceMappingURL=internationalization.store.d.ts.map