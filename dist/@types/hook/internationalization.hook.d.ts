import * as React from 'react';
import { Container } from 'inversify';
import { Translator } from '../service/internationalization.service';
export declare const InternationalizationKeyContext: React.Context<string>;
export declare const I18nKeyContextConsumer: React.ExoticComponent<React.ConsumerProps<string>>, I18nKeyContextProvider: React.ProviderExoticComponent<React.ProviderProps<string>>;
export interface InternationalizationHookReturnType {
    setLocale: (locale: string) => void;
    translator: Translator;
    currentLocale: string;
    defaultLocale: string;
    locales: string[];
}
export declare const createI18nHook: (container: Container) => (keys: string[], context?: string) => InternationalizationHookReturnType;
