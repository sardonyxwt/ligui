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

    const internationalizationKeyContext = React.useContext(InternationalizationKeyContext);

    const internationalizationContext = context || internationalizationKeyContext;

    const {currentLocale, defaultLocale, locales} = internationalizationService;

    function checkIsTranslateUnitsLoaded () {
        return keys
            .map(key => internationalizationService.isTranslateUnitLoaded({
                key, context: internationalizationContext, locale: currentLocale
            }))
            .reduce((v1, v2) => v1 && v2);
    }

    const [isTranslateUnitsLoaded, setIsTranslateUnitsLoaded] = React.useState<boolean>(checkIsTranslateUnitsLoaded);

    React.useEffect(() => {
        if (isTranslateUnitsLoaded) {
            return;
        }
        Promise.all(keys.map(key => internationalizationService.loadTranslateUnitData({
            key, context: internationalizationContext, locale: currentLocale
        }))).then(() => setIsTranslateUnitsLoaded(true));
    }, [isTranslateUnitsLoaded]);

    React.useEffect(() => {
        return internationalizationService.onSetLocale(
            () => setIsTranslateUnitsLoaded(checkIsTranslateUnitsLoaded)
        );
    }, []);

    return {
        translator: isTranslateUnitsLoaded
            ? internationalizationService.getTranslator(internationalizationContext, currentLocale)
            : (<T>(id) => `<${id}>` as unknown as T),
        setLocale: (locale: string) => internationalizationService.setLocale(locale),
        currentLocale,
        defaultLocale,
        locales
    };
};
