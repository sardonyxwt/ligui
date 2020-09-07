import { Scope, Store } from '@sardonyxwt/state-store';
import { saveToArray, copyArray } from '@source/util/object.utils';
import { CoreTypes } from '@source/types';

/**
 * @interface TranslateUnitId
 * @description TranslateUnitId identify translate unit in store.
 */
export interface TranslateUnitId {
    /**
     * @field key
     * @description Key in context.
     * Create Unique pair with locale in context.
     */
    readonly key: string;
    /**
     * @field locale
     * @description Locale in context.
     * Create Unique pair with key in context.
     */
    readonly locale: string;
    /**
     * @field context
     * @description Unique context in application.
     * Used to select loader for config.
     */
    readonly context?: string;
}

export type TranslateUnitData = Record<string, unknown>;

/**
 * @interface TranslateUnit
 * @description TranslateUnit instance in store.
 */
export interface TranslateUnit {
    /**
     * @field id
     * @description Unique pair of key, locale and context.
     */
    readonly id: TranslateUnitId;
    /**
     * @field data
     * @description Translate unit data.
     */
    readonly data: TranslateUnitData;
}

/**
 * @interface InternationalizationStoreState
 * @description Internationalization store state.
 */
export interface InternationalizationStoreState {
    /**
     * @field currentLocale
     * @description Current locale selected for application.
     */
    currentLocale: string;
    /**
     * @field defaultLocale
     * @description Fallback locale for application.
     */
    defaultLocale: string;
    /**
     * @field locales
     * @description All available locales in application.
     */
    readonly locales: string[];
    /**
     * @field translateUnits
     * @description All loaded translation units.
     */
    readonly translateUnits: TranslateUnit[];
}

/**
 * @interface InternationalizationStore
 * @description Store for i18n.
 */
export interface InternationalizationStore
    extends Scope<InternationalizationStoreState> {
    //TODO
    setLocale(locale: string): void;
    getCurrentLocale(): string;
    getDefaultLocale(): string;
    getLocales(): string[];

    /**
     * @method setTranslateUnits
     * @description Add or replace translates units in store.
     * @param translateUnits {TranslateUnit[]} Translates units to be added or replaced.
     */
    setTranslateUnits(translateUnits: TranslateUnit[]): void;

    /**
     * @method setTranslationForLocale
     * @description Add translation units to context with locale.
     * @param locale Locale for add translation units.
     * @param translationObject Map of key and translation unit data.
     * @param context Context for translation units.
     */
    setTranslationForLocale(
        locale: string,
        translationObject: Record<string, TranslateUnitData>,
        context?: string,
    ): void;

    /**
     * @method findTranslateUnitById
     * @description Return translation unit with same id.
     * @param id {TranslateUnitId} Id used to find translate unit in store.
     * @returns {TranslateUnit>}
     */
    findTranslateUnitById(id: TranslateUnitId): TranslateUnit;

    /**
     * @method isLocaleExist
     * @description Check is locale available to use.
     * @param locale {string} Check is locale exist in store.
     * @returns {boolean}
     */
    isLocaleExist(locale: string): boolean;

    /**
     * @method isTranslateUnitExist
     * @description Check is translation unit with same id present in store.
     * @param id {TranslateUnitId} Id used to check translate unit present in store.
     * @returns {boolean}
     */
    isTranslateUnitExist(id: TranslateUnitId): boolean;
}

export enum InternationalizationStoreActions {
    ChangeLocale = 'ChangeLocale',
    UpdateTranslateUnits = 'UpdateTranslateUnits',
}

export const createInternationalizationStore = (
    store: Store,
    initState: InternationalizationStoreState,
): InternationalizationStore => {
    const internationalizationStore = store.createScope(
        {
            name: CoreTypes.InternationalizationStore,
            initState: {
                currentLocale: initState.currentLocale || null,
                defaultLocale: initState.defaultLocale || null,
                locales: initState.locales || [],
                translateUnits: initState.translateUnits || [],
            },
            isSubscribedMacroAutoCreateEnabled: true,
        },
        true,
    ) as InternationalizationStore;

    internationalizationStore.setLocale = internationalizationStore.registerAction(
        InternationalizationStoreActions.ChangeLocale,
        (state, locale: string) => {
            if (!internationalizationStore.isLocaleExist(locale)) {
                throw new Error('Locale not present in locales.');
            }

            return {
                ...state,
                currentLocale: locale,
            };
        },
    );

    internationalizationStore.setTranslateUnits = internationalizationStore.registerAction(
        InternationalizationStoreActions.UpdateTranslateUnits,
        (state, translateUnits: TranslateUnit[]) => {
            const updatedTranslateUnits = copyArray(state.translateUnits);
            translateUnits.forEach((translateUnit) =>
                saveToArray(
                    updatedTranslateUnits,
                    translateUnit,
                    (existTranslateUnit) =>
                        isTranslateUnitsIdsEqual(
                            translateUnit.id,
                            existTranslateUnit.id,
                        ),
                ),
            );
            return {
                ...state,
                translateUnits: updatedTranslateUnits,
            };
        },
    );

    internationalizationStore.setTranslationForLocale = (
        locale: string,
        translationObject: Record<string, TranslateUnitData>,
        context?,
    ) => {
        const translationUnits: TranslateUnit[] = Object.getOwnPropertyNames(
            translationObject,
        ).map((key) => ({
            id: { key, locale, context },
            data: translationObject[key],
        }));
        internationalizationStore.setTranslateUnits(translationUnits);
    };

    internationalizationStore.getCurrentLocale = () =>
        internationalizationStore.state.currentLocale;
    internationalizationStore.getDefaultLocale = () =>
        internationalizationStore.state.defaultLocale;
    internationalizationStore.getLocales = () =>
        internationalizationStore.state.locales;

    internationalizationStore.findTranslateUnitById = (id: TranslateUnitId) => {
        return internationalizationStore.state.translateUnits.find(
            (translateUnit) => isTranslateUnitsIdsEqual(translateUnit.id, id),
        );
    };

    internationalizationStore.isLocaleExist = (locale: string) => {
        return !!internationalizationStore.state.locales.find(
            (it) => it === locale,
        );
    };

    internationalizationStore.isTranslateUnitExist = (id: TranslateUnitId) => {
        return !!internationalizationStore.findTranslateUnitById(id);
    };

    return internationalizationStore;
};

/**
 * @function isTranslateUnitsIdsEqual
 * @description Check is translates units ids is equals.
 * @param configId1 {TranslateUnitId} First translate unit id to check equals.
 * @param configId2 {TranslateUnitId} Second translate unit id to check equals.
 * @returns {boolean}
 */
export function isTranslateUnitsIdsEqual(
    translateUnitId1: TranslateUnitId,
    translateUnitId2: TranslateUnitId,
): boolean {
    return (
        translateUnitId1.key === translateUnitId2.key &&
        translateUnitId1.locale === translateUnitId2.locale &&
        translateUnitId1.context === translateUnitId2.context
    );
}
