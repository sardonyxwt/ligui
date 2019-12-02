import * as React from 'react';
import { Container } from 'inversify';
import { ConfigUnitData } from '../scope/config.scope';
declare let ConfigKeyContext: React.Context<string>;
export { ConfigKeyContext };
export declare const createConfigHook: (container: Container) => <T extends ConfigUnitData = ConfigUnitData>(configUnitKey: string, context?: string) => T;
//# sourceMappingURL=config.hook.d.ts.map