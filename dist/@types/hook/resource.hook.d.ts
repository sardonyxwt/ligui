import * as React from 'react';
import { Container } from 'inversify';
declare let ResourceKeyContext: React.Context<string>;
export { ResourceKeyContext };
export declare const createResourceHook: (container: Container) => <T = any>(key: string, context?: string) => T;
//# sourceMappingURL=resource.hook.d.ts.map