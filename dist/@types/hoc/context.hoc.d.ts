import * as React from 'react';
export interface ContextHOCInjectedProps<TContext> {
    context?: TContext;
}
export declare function context<TContext>(Consumer: React.Consumer<TContext>): <TOriginalProps extends {}>(Component: React.ComponentType<TOriginalProps & ContextHOCInjectedProps<TContext>>) => any;
