import * as React from 'react';
import { Container } from 'inversify';
import { Translator } from '../service/internationalization.service';
declare let InternationalizationKeyContext: React.Context<string>;
export { InternationalizationKeyContext };
export interface InternationalizationHookReturnType {
    setLocale: (locale: string) => void;
    currentLocale: string;
    defaultLocale: string;
    locales: string[];
}
export declare const createI18nHook: (container: Container) => () => InternationalizationHookReturnType;
export declare type TranslatorHookReturnType = [Translator, boolean];
export declare const createTranslatorHook: (container: Container) => (key: string, context?: string) => [Translator, boolean];
//# sourceMappingURL=internationalization.hook.d.ts.map