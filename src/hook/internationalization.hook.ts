import * as React from 'react';
import {
    Translator,
    TranslatorArgs,
} from '@source/service/internationalization.service';
import {
    RESET_SCOPE_ACTION,
    RESTORE_SCOPE_ACTION,
} from '@sardonyxwt/state-store';
import {
    TranslateUnitId,
    InternationalizationStoreActions,
    isTranslateUnitsIdsEqual,
    TranslateUnit,
} from '@source/store/internationalization.store';
import { ModuleContext } from '@source/context/module.context';
import { Core } from '@source/core';

export interface InternationalizationHookReturnType {
    setLocale: (locale: string) => void;
    currentLocale: string;
    defaultLocale: string;
    locales: string[];
}

export type I18nHook = () => InternationalizationHookReturnType;

/**
 * @function createI18nHook
 * @param coreGlobalRegisterName {string} Core instance global name.
 * @returns React hook for i18n managing.
 */
export const createI18nHook = (coreGlobalRegisterName: string): I18nHook => {
    return (): InternationalizationHookReturnType => {
        const core = global[coreGlobalRegisterName] as Core;

        const store = core.internationalization.store;
        const prepareI18nState = (): InternationalizationHookReturnType => ({
            setLocale: (locale: string) => store.setLocale(locale),
            currentLocale: store.getCurrentLocale(),
            defaultLocale: store.getDefaultLocale(),
            locales: store.getLocales(),
        });

        const [i18nState, setI18nState] = React.useState<
            InternationalizationHookReturnType
        >(prepareI18nState);

        React.useEffect(() => {
            return store.subscribe(() => {
                setI18nState(prepareI18nState());
            }, [
                InternationalizationStoreActions.ChangeLocale,
                RESET_SCOPE_ACTION,
                RESTORE_SCOPE_ACTION,
            ]);
        }, []);

        return i18nState;
    };
};

export type TranslatorHookReturnType = [Translator, boolean];

/**
 * @type TranslatorHook
 * @description React hook for translation.
 * @param translateUnitKey {string} Translate unit key.
 * @param context {string} Translate unit context for loader selection.
 * @returns {TranslatorHookReturnType}
 * */
export type TranslatorHook = (
    translateUnitKey: string,
    context?: string,
) => TranslatorHookReturnType;

/**
 * @function createTranslatorHook
 * @param coreGlobalRegisterName {string} Core instance global name.
 * @returns React hook for translate unit loading used loaders
 * and translation.
 */
export const createTranslatorHook = (
    coreGlobalRegisterName: string,
): TranslatorHook => {
    return (
        translateUnitKey: string,
        context?: string,
    ): TranslatorHookReturnType => {
        const core = global[coreGlobalRegisterName] as Core;

        const store = core.internationalization.store;
        const service = core.internationalization.service;

        const internationalizationContext =
            context || React.useContext(ModuleContext);

        const getTranslator = (): Translator => {
            const translator = core.internationalization.service.getTranslator(
                internationalizationContext,
            );
            translator.prefix = `${translateUnitKey}.`;
            return translator;
        };

        const getId = (): TranslateUnitId => ({
            key: translateUnitKey,
            context: internationalizationContext,
            locale: store.getCurrentLocale(),
        });

        const prepareTranslator = () => {
            const id = getId();
            if (store.isTranslateUnitExist(id)) {
                return getTranslator();
            }
            const translateUnit = service.loadTranslateUnit(id);
            if (translateUnit instanceof Promise) {
                return;
            }
            return getTranslator();
        };

        const [translator, setTranslator] = React.useState<Translator>(
            prepareTranslator,
        );

        React.useEffect(() => {
            return store.subscribe(
                (event) => {
                    if (
                        event.actionName ===
                        InternationalizationStoreActions.UpdateTranslateUnits
                    ) {
                        const translateUnitId = getId();
                        const updatedTranslateUnits = event.props as TranslateUnit[];
                        const isTranslateUnitUpdated =
                            updatedTranslateUnits.findIndex((it) =>
                                isTranslateUnitsIdsEqual(
                                    it.id,
                                    translateUnitId,
                                ),
                            ) >= 0;

                        if (!isTranslateUnitUpdated) {
                            return;
                        }
                    }

                    const translator = prepareTranslator();
                    if (translator) {
                        setTranslator(() => translator);
                    }
                },
                [
                    InternationalizationStoreActions.ChangeLocale,
                    InternationalizationStoreActions.UpdateTranslateUnits,
                    RESET_SCOPE_ACTION,
                    RESTORE_SCOPE_ACTION,
                ],
            );
        }, []);

        return [
            translator ||
                ((<T>(_, argsOrDefaultValue?: T | TranslatorArgs<T>) =>
                    typeof argsOrDefaultValue === 'object'
                        ? (argsOrDefaultValue as TranslatorArgs<T>).defaultValue
                        : argsOrDefaultValue) as Translator),
            !!translator,
        ];
    };
};
