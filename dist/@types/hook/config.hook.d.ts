import * as React from 'react';
import { Container } from 'inversify';
import { ConfigData } from '../store/config.store';
declare let ConfigKeyContext: React.Context<string>;
export { ConfigKeyContext };
export declare const createConfigHook: (container: Container) => <T extends ConfigData = ConfigData>(key: string, context?: string) => T;
//# sourceMappingURL=config.hook.d.ts.map