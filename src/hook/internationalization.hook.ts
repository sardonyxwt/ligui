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
    translator: Translator;
    currentLocale: string;
    defaultLocale: string;
    locales: string[];
}

export const createI18nHook = (
    container: Container
) => (
    keys: string[], context?: string
): InternationalizationHookReturnType => {
    const internationalizationService = container.get<InternationalizationService>(LIGUI_TYPES.INTERNATIONALIZATION_SERVICE);

    const internationalizationContext = context || React.useContext(InternationalizationKeyContext);

    function getTranslator() {
        return internationalizationService.getTranslator(
            internationalizationContext,
            internationalizationService.currentLocale
        );
    }

    function checkIsTranslateUnitsLoaded () {
        return keys
            .map(key => internationalizationService.isTranslateUnitLoaded({
                key, context: internationalizationContext, locale: internationalizationService.currentLocale
            }))
            .reduce((v1, v2) => v1 && v2);
    }

    const [translator, setTranslator] = React.useState<Translator>(() => {
        return checkIsTranslateUnitsLoaded() ? getTranslator() : null;
    });

    React.useEffect(() => {
        if (translator) {
            return;
        }
        Promise.all(keys.map(key => internationalizationService.loadTranslateUnitData({
            key, context: internationalizationContext, locale: internationalizationService.currentLocale
        }))).then(() => setTranslator(() => getTranslator()));
    }, [translator]);

    React.useEffect(() => {
        return internationalizationService.onSetLocale(
            () => setTranslator(() => checkIsTranslateUnitsLoaded() ? getTranslator() : null)
        );
    }, []);

    return {
        translator: translator || (<T>() => null as T),
        setLocale: (locale: string) => internationalizationService.setLocale(locale),
        currentLocale: internationalizationService.currentLocale,
        defaultLocale: internationalizationService.defaultLocale,
        locales: internationalizationService.locales
    };
};
