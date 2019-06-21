import * as React from 'react';
import { Container } from 'inversify';
import { Translator } from '../service/localization.service';
export declare const LocalizationKeyContext: React.Context<string>;
export declare const LocalizationKeyContextConsumer: React.ExoticComponent<React.ConsumerProps<string>>, LocalizationKeyContextProvider: React.ProviderExoticComponent<React.ProviderProps<string>>;
export declare const createTranslatorHook: (container: Container) => (keys: string[], context?: string) => Translator;
