import { observable, action, computed, toJS } from 'mobx';
import { saveToArray } from '@sardonyxwt/utils/object';
import { Repository } from '../service/repository.service';

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

export interface InternationalizationStoreState {
    currentLocale: string;
    defaultLocale: string;
    readonly locales: string[];
    readonly translateUnits: TranslateUnit[];
}

export interface InternationalizationStore extends InternationalizationStoreState, Repository<InternationalizationStoreState> {
    setTranslateUnit(...translateUnits: TranslateUnit[]): void;

    findTranslateUnitById(id: TranslateUnitId): TranslateUnit;

    isLocaleExist(locale: string): boolean;
    isTranslateUnitExist(id: TranslateUnitId): boolean;
}

export class InternationalizationStoreImpl implements InternationalizationStore {

    @observable private _currentLocale: string = null;
    @observable private _defaultLocale: string = null;
    @observable readonly locales: string[] = [];
    @observable.shallow readonly translateUnits: TranslateUnit[] = [];

    constructor(
        locales: string[] = [],
        currentLocale: string = (locales.length > 0 ? locales[0] : null),
        defaultLocale: string = currentLocale,
        translateUnits: TranslateUnit[] = []
    ) {
        this._currentLocale = currentLocale;
        this._defaultLocale = defaultLocale;
        this.locales.push(...locales);
        this.translateUnits.push(...translateUnits);
    }

    @action setTranslateUnit(...translateUnits: TranslateUnit[]): void {
        translateUnits.forEach(translateUnit => saveToArray(
            this.translateUnits, translateUnit,
            existTranslateUnit => isTranslateUnitsIdsEqual(translateUnit.id, existTranslateUnit.id)
        ));
    }

    set currentLocale(locale: string) {
        this.checkLocale(locale);
        this._currentLocale = locale;
    }

    set defaultLocale(locale: string) {
        this.checkLocale(locale);
        this._defaultLocale = locale;
    }

    @computed get currentLocale() {
        return this._currentLocale;
    }

    @computed get defaultLocale() {
        return this._defaultLocale;
    }

    findTranslateUnitById(id: TranslateUnitId): TranslateUnit {
        return this.translateUnits.find(translateUnit => isTranslateUnitsIdsEqual(translateUnit.id, id))
    }

    isLocaleExist(locale: string): boolean {
        return !!this.locales.find(locale => locale === locale);
    }

    isTranslateUnitExist(id: TranslateUnitId): boolean {
        return !!this.findTranslateUnitById(id);
    }

    collect(): InternationalizationStoreState {
        return {
            locales: toJS(this.locales),
            currentLocale: toJS(this._currentLocale),
            defaultLocale: toJS(this._defaultLocale),
            translateUnits: toJS(this.translateUnits)
        }
    }

    restore(state: InternationalizationStoreState): void {
        this._currentLocale = state.currentLocale;
        this._defaultLocale = state.defaultLocale;
        this.locales.splice(0, this.locales.length);
        this.locales.push(...state.locales);
        this.translateUnits.push(...state.translateUnits);
        this.translateUnits.splice(0, this.translateUnits.length);
    }

    reset(): void {
        this.translateUnits.splice(0, this.translateUnits.length);
    }

    private checkLocale(locale: string) {
        const isLocalNotAvailable = !this.locales.find(it => it === locale);

        if (isLocalNotAvailable) {
            throw new Error('Locale not present in locales.');
        }
    }

}

export function isTranslateUnitsIdsEqual(translateUnitId1: TranslateUnitId, translateUnitId2: TranslateUnitId) {
    return translateUnitId1.key === translateUnitId2.key
        && translateUnitId1.locale === translateUnitId2.locale
        && translateUnitId1.context === translateUnitId2.context;
}