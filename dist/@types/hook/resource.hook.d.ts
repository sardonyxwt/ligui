import * as React from 'react';
import { Container } from 'inversify';
export declare const ResourceKeyContext: React.Context<string>;
export declare const ResourceKeyContextConsumer: React.ExoticComponent<React.ConsumerProps<string>>, ResourceKeyContextProvider: React.ProviderExoticComponent<React.ProviderProps<string>>;
export declare const createResourceHook: (container: Container) => <T = any>(key: string, context?: string) => T;
