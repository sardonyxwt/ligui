import * as React from 'react';
import { StoreService, Scope } from '..';
export interface StateHOCInjectedProps<T extends {} = {}> {
    state?: T;
}
export declare type StateHocType = <T>(scope: string | Scope<T>, actions: string[], retention: any) => <P extends {}, C extends React.ComponentType<P> = React.ComponentType<P>>(Component: C) => C;
export declare function createStateHocInstance(storeService: StoreService): StateHocType;
