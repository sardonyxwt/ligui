import * as React from 'react';
export interface ContextHOCInjectedProps<TContext> {
    context?: TContext;
}
export declare type ContextHocType = <TContext>(Consumer: React.Consumer<TContext>) => <P extends ContextHOCInjectedProps<TContext>, C extends React.ComponentType<P> = React.ComponentType<P>>(Component: C) => C;
export declare function createContextHocInstance(): ContextHocType;
