import * as React from 'react';
import { Container } from 'inversify';
import { InternationalizationService, Translator } from '../service/internationalization.service';
import { LIGUI_TYPES } from '../types';

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
    const internationalizationService = container.get<InternationalizationService>(LIGUI_TYPES.INTERNATIONALIZATION_SERVICE);

    const prepareI18nState = (): InternationalizationHookReturnType => ({
        setLocale: (locale: string) => internationalizationService.setLocale(locale),
        currentLocale: internationalizationService.currentLocale,
        defaultLocale: internationalizationService.defaultLocale,
        locales: internationalizationService.locales
    });

    const [i18nState, setI18nState] = React.useState<InternationalizationHookReturnType>(prepareI18nState);

    React.useEffect(() => {
        return internationalizationService.onSetLocale(() => setI18nState(prepareI18nState));
    }, []);

    return i18nState;
};

export type TranslatorHookReturnType = [Translator, boolean];

export const createTranslatorHook = (
    container: Container
) => (
    translateUnitKey: string, context?: string
): TranslatorHookReturnType => {
    const internationalizationService = container.get<InternationalizationService>(LIGUI_TYPES.INTERNATIONALIZATION_SERVICE);

    const internationalizationContext = context || React.useContext(InternationalizationKeyContext);

    function getTranslator(): Translator {
        const translator = internationalizationService.getTranslator(
            internationalizationContext,
            internationalizationService.currentLocale
        );

        return <T = string>(key: string, defaultValue?: T) => translator<T>(`${translateUnitKey}.${key}`, defaultValue);
    }

    function checkIsTranslateUnitLoaded() {
        return internationalizationService.isTranslateUnitLoaded({
            key: translateUnitKey, context: internationalizationContext, locale: internationalizationService.currentLocale
        });
    }

    function prepareTranslator() {
        return checkIsTranslateUnitLoaded() ? getTranslator() : null;
    }

    const [translator, setTranslator] = React.useState<Translator>(prepareTranslator);

    React.useEffect(() => {
        if (translator) {
            return;
        }
        internationalizationService.loadTranslateUnitData({
            key: translateUnitKey, context: internationalizationContext, locale: internationalizationService.currentLocale
        }).then(() => setTranslator(getTranslator));
    }, [translator]);

    React.useEffect(() => {
        return internationalizationService.onSetLocale(
            () => setTranslator(prepareTranslator)
        );
    }, []);

    return [
        translator || (<T>(id, defaultValue) => defaultValue as T), !!translator
    ];
};
