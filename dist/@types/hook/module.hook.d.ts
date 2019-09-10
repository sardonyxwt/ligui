import * as React from 'react';
import { Container } from 'inversify';
declare let ModuleKeyContext: React.Context<string>;
export { ModuleKeyContext };
export declare const createModuleHook: (container: Container) => <T = any>(key: string, context?: string) => T;
//# sourceMappingURL=module.hook.d.ts.map