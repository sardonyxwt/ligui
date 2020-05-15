import { Scope, Store } from '@sardonyxwt/state-store';
import { saveToArray, copyArray } from '@sardonyxwt/utils/object';
import { LIGUI_TYPES } from '../types';

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

export interface InternationalizationStore extends Scope<InternationalizationStoreState> {
    setLocale(locale: string): void;
    setTranslateUnits(translateUnits: TranslateUnit[]): void;

    findTranslateUnitById(id: TranslateUnitId): TranslateUnit;

    isLocaleExist(locale: string): boolean;
    isTranslateUnitExist(id: TranslateUnitId): boolean;
}

export enum InternationalizationStoreActions {
    ChangeLocale = 'CHANGE_LOCALE',
    UpdateTranslateUnits = 'UPDATE_TRANSLATE_UNITS'
}

export const createInternationalizationStore = (store: Store, initState: InternationalizationStoreState) => {
    const internationalizationStore = store.createScope({
        name: LIGUI_TYPES.INTERNATIONALIZATION_STORE,
        initState,
        isSubscribedMacroAutoCreateEnabled: true,
    }, true) as InternationalizationStore;

    internationalizationStore.setLocale = internationalizationStore.registerAction(
        InternationalizationStoreActions.ChangeLocale,
        (state, locale: string) => {
            if (!internationalizationStore.isLocaleExist(locale)) {
                throw new Error('Locale not present in locales.');
            }

            return {
                ...state,
                currentLocale: locale
            }
        }
    );

    internationalizationStore.setTranslateUnits = internationalizationStore.registerAction(
        InternationalizationStoreActions.UpdateTranslateUnits,
        (state, translateUnits: TranslateUnit[]) => {
            const updatedTranslateUnits = copyArray(state.translateUnits);
            translateUnits.forEach(translateUnit => saveToArray(
                updatedTranslateUnits, translateUnit,
                existTranslateUnit => isTranslateUnitsIdsEqual(translateUnit.id, existTranslateUnit.id)
            ));
            return {
                ...state,
                translateUnits: updatedTranslateUnits
            }
        }
    );

    internationalizationStore.findTranslateUnitById = (id: TranslateUnitId) => {
        return internationalizationStore.state.translateUnits.find(
            translateUnit => isTranslateUnitsIdsEqual(translateUnit.id, id)
        );
    };

    internationalizationStore.isLocaleExist = (locale: string) => {
        return !!internationalizationStore.state.locales.find(it => it === locale);
    };

    internationalizationStore.isTranslateUnitExist = (id: TranslateUnitId) => {
        return !!internationalizationStore.findTranslateUnitById(id);
    };

    return internationalizationStore;
}

export function isTranslateUnitsIdsEqual(translateUnitId1: TranslateUnitId, translateUnitId2: TranslateUnitId) {
    return translateUnitId1.key === translateUnitId2.key
        && translateUnitId1.locale === translateUnitId2.locale
        && translateUnitId1.context === translateUnitId2.context;
}
