import * as Container from 'bottlejs';
import * as React from 'react';
declare let ConfigKeyContext: React.Context<string>;
export { ConfigKeyContext };
export declare const createConfigHook: (container: Container.IContainer) => <T extends Record<string, unknown> = Record<string, unknown>>(key: string, context?: string) => T;
