import * as React from 'react';
import * as Container from 'bottlejs';
import {
    RESET_SCOPE_ACTION,
    RESTORE_SCOPE_ACTION,
} from '@sardonyxwt/state-store';
import {
    InternationalizationService,
    Translator,
} from '../service/internationalization.service';
import { LIGUI_TYPES } from '../types';
import {
    InternationalizationStore,
    InternationalizationStoreActions,
    isTranslateUnitsIdsEqual,
    TranslateUnit,
    TranslateUnitId,
} from '../store/internationalization.store';

let InternationalizationKeyContext: React.Context<string> = null;

if (!!React) {
    InternationalizationKeyContext = React.createContext<string>(undefined);
}

export { InternationalizationKeyContext };

export interface InternationalizationHookReturnType {
    setLocale: (locale: string) => void;
    currentLocale: string;
    defaultLocale: string;
    locales: string[];
}

export const createI18nHook = (
    container: Container.IContainer,
) => (): InternationalizationHookReturnType => {
    const internationalizationStore = container[
        LIGUI_TYPES.INTERNATIONALIZATION_STORE
    ] as InternationalizationStore;

    const prepareI18nState = (): InternationalizationHookReturnType => ({
        setLocale: (locale: string) =>
            internationalizationStore.setLocale(locale),
        currentLocale: internationalizationStore.getCurrentLocale(),
        defaultLocale: internationalizationStore.getDefaultLocale(),
        locales: internationalizationStore.getLocales(),
    });

    const [i18nState, setI18nState] = React.useState<
        InternationalizationHookReturnType
    >(prepareI18nState);

    React.useEffect(() => {
        return internationalizationStore.subscribe(() => {
            setI18nState(prepareI18nState());
        }, [
            InternationalizationStoreActions.ChangeLocale,
            RESET_SCOPE_ACTION,
            RESTORE_SCOPE_ACTION,
        ]);
    }, []);

    return i18nState;
};

export type TranslatorHookReturnType = [Translator, boolean];

export const createTranslatorHook = (container: Container.IContainer) => (
    translateUnitKey: string,
    context?: string,
): TranslatorHookReturnType => {
    const internationalizationStore = container[
        LIGUI_TYPES.INTERNATIONALIZATION_STORE
    ] as InternationalizationStore;
    const internationalizationService = container[
        LIGUI_TYPES.INTERNATIONALIZATION_SERVICE
    ] as InternationalizationService;

    const internationalizationContext =
        context || React.useContext(InternationalizationKeyContext);

    const getTranslator = (): Translator => {
        const translator = internationalizationService.getTranslator(
            internationalizationContext,
        );
        translator.prefix = `${translateUnitKey}.`;
        return translator;
    };

    const getId = (): TranslateUnitId => ({
        key: translateUnitKey,
        context: internationalizationContext,
        locale: internationalizationStore.getCurrentLocale(),
    });

    const prepareTranslator = () => {
        const id = getId();
        if (internationalizationStore.isTranslateUnitExist(id)) {
            return getTranslator();
        }
        const translateUnit = internationalizationService.loadTranslateUnit(id);
        return translateUnit instanceof Promise ? null : getTranslator();
    };

    const [translator, setTranslator] = React.useState<Translator>(
        prepareTranslator,
    );

    React.useEffect(() => {
        return internationalizationStore.subscribe(
            (event) => {
                if (
                    event.actionName ===
                    InternationalizationStoreActions.UpdateTranslateUnits
                ) {
                    const translateUnitId = getId();
                    const updatedTranslateUnits = event.props as TranslateUnit[];
                    const isTranslateUnitUpdated =
                        updatedTranslateUnits.findIndex((it) =>
                            isTranslateUnitsIdsEqual(it.id, translateUnitId),
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
            ((<T>(id, defaultValue) => defaultValue as T) as Translator),
        !!translator,
    ];
};
