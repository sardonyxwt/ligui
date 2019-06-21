import * as React from 'react';
import { Container } from 'inversify';
export declare const ModuleKeyContext: React.Context<string>;
export declare const ModuleKeyContextConsumer: React.ExoticComponent<React.ConsumerProps<string>>, ModuleKeyContextProvider: React.ProviderExoticComponent<React.ProviderProps<string>>;
export declare const createModuleHook: (container: Container) => <T = any>(key: string, context?: string) => T;
