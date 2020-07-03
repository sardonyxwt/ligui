import * as React from 'react';
import * as Container from 'bottlejs';
declare let ModuleKeyContext: React.Context<string>;
export { ModuleKeyContext };
export declare const createModuleHook: (container: Container.IContainer) => <T = unknown>(key: string, context?: string) => T;
