import * as React from 'react';
import * as Container from 'bottlejs';
declare let ResourceKeyContext: React.Context<string>;
export { ResourceKeyContext };
export declare const createResourceHook: (container: Container.IContainer) => <T = unknown>(key: string, context?: string) => T;
