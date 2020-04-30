import * as React from 'react';
import { reaction } from 'mobx';
import { Container } from 'inversify';
import { InternationalizationService, Translator } from '../service/internationalization.service';
import { LIGUI_TYPES } from '../types';
import { InternationalizationStore, TranslateUnitId } from '../store/internationalization.store';

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
    container: Container
) => (): InternationalizationHookReturnType => {
    const internationalizationStore = container.get<InternationalizationStore>(LIGUI_TYPES.INTERNATIONALIZATION_STORE);

    const prepareI18nState = (): InternationalizationHookReturnType => ({
        setLocale: (locale: string) => internationalizationStore.currentLocale = locale,
        currentLocale: internationalizationStore.currentLocale,
        defaultLocale: internationalizationStore.defaultLocale,
        locales: internationalizationStore.locales
    });

    const [i18nState, setI18nState] = React.useState<InternationalizationHookReturnType>(prepareI18nState);

    React.useEffect(() => reaction(prepareI18nState, setI18nState), []);

    return i18nState;
};

export type TranslatorHookReturnType = [Translator, boolean];

export const createTranslatorHook = (
    container: Container
) => (
    translateUnitKey: string, context?: string
): TranslatorHookReturnType => {
    const internationalizationStore = container.get<InternationalizationStore>(LIGUI_TYPES.INTERNATIONALIZATION_STORE);
    const internationalizationService = container.get<InternationalizationService>(LIGUI_TYPES.INTERNATIONALIZATION_SERVICE);

    const internationalizationContext = context || React.useContext(InternationalizationKeyContext);

    const getId = () => ({
        key: translateUnitKey,
        context: internationalizationContext,
        locale: internationalizationStore.currentLocale
    }) as TranslateUnitId;

    const getTranslator = (): Translator =>  {
        const translator = internationalizationService.getTranslator(internationalizationContext);
        return <T = string>(key: string, defaultValue?: T) => translator<T>(`${translateUnitKey}.${key}`, defaultValue);
    };

    const prepareTranslator = () => {
        const id = getId();
        if (internationalizationStore.isTranslateUnitExist(id)) {
            return getTranslator();
        }
        const translateUnit = internationalizationService.loadTranslateUnit(id);
        return translateUnit instanceof Promise ? null : getTranslator();
    };

    const [translator, setTranslator] = React.useState<Translator>(prepareTranslator);

    React.useEffect(() => {
        if (translator) {
            return;
        }
        internationalizationService.loadTranslateUnit(getId());
    }, [translator]);

    React.useEffect(() => reaction(
        prepareTranslator,
        translator => setTranslator(() => translator)
    ), []);

    return [
        translator || (<T>(id, defaultValue) => defaultValue as T), !!translator
    ];
};
