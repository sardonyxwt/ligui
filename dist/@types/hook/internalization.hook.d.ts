import * as React from 'react';
import { Container } from 'inversify';
import { Translator } from '../service/internalization.service';
export declare const InternalizationKeyContext: React.Context<string>;
export declare const InternalizationKeyContextConsumer: React.ExoticComponent<React.ConsumerProps<string>>, InternalizationKeyContextProvider: React.ProviderExoticComponent<React.ProviderProps<string>>;
export interface InternalizationHookReturnType {
    setLocale: (locale: string) => void;
    translator: Translator;
    currentLocale: string;
    defaultLocale: string;
    locales: string[];
}
export declare const createInternalizationHook: (container: Container) => (keys: string[], context?: string) => InternalizationHookReturnType;
