import * as React from 'react';
export interface ContextHOCInjectedProps<TContext> {
    context?: TContext;
}
export declare function withContext<TContext>(Consumer: React.Consumer<TContext>): <P extends ContextHOCInjectedProps<TContext>, C extends React.ComponentType<P> = React.ComponentType<P>>(Component: C) => C;
