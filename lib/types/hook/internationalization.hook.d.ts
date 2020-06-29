import * as React from 'react';
import * as Container from 'bottlejs';
import { Translator } from '../service/internationalization.service';
declare let InternationalizationKeyContext: React.Context<string>;
export { InternationalizationKeyContext };
export interface InternationalizationHookReturnType {
    setLocale: (locale: string) => void;
    currentLocale: string;
    defaultLocale: string;
    locales: string[];
}
export declare const createI18nHook: (container: Container.IContainer) => () => InternationalizationHookReturnType;
export declare type TranslatorHookReturnType = [Translator, boolean];
export declare const createTranslatorHook: (container: Container.IContainer) => (translateUnitKey: string, context?: string) => TranslatorHookReturnType;
