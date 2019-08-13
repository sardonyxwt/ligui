import * as React from 'react';
import { Container } from 'inversify';
import { Translator } from '../service/internationalization.service';
declare let InternationalizationKeyContext: React.Context<string>;
export { InternationalizationKeyContext };
export interface InternationalizationHookReturnType {
    setLocale: (locale: string) => void;
    translator: Translator;
    currentLocale: string;
    defaultLocale: string;
    locales: string[];
}
export declare const createI18nHook: (container: Container) => (keys: string[], context?: string) => InternationalizationHookReturnType;
