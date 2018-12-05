import * as React from 'react';
import { Scope } from '..';
export interface StateHOCInjectedProps<T extends {} = {}> {
    state?: T;
}
export declare function withState<T>(scope: string | Scope<T>, actions?: string[], retention?: number): <P extends {}, C extends React.ComponentType<P> = React.ComponentType<P>>(Component: C) => C;
