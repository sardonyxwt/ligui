import * as React from 'react';
export interface SubscribeScopeSetting {
    scopeName: string;
    actions?: string[];
}
export declare function subscribe<T>(injectedScopeStates: (string | SubscribeScopeSetting)[]): <TOriginalProps extends {}>(Component: React.ComponentType<TOriginalProps>) => React.ComponentType<TOriginalProps>;
