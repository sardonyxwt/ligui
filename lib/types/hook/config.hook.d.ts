import * as Container from 'bottlejs';
import * as React from 'react';
import { ConfigData } from '../store/config.store';
declare let ConfigKeyContext: React.Context<string>;
export { ConfigKeyContext };
export declare const createConfigHook: (container: Container.IContainer) => <T extends ConfigData = ConfigData>(key: string, context?: string) => T;
