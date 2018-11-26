import * as React from 'react';
export interface SubscribeScopeSetting {
    scopeName: string;
    actions?: string[];
}
export declare function subscribe(injectedScopeStates: (string | SubscribeScopeSetting)[]): <P extends {}, C extends React.ComponentType<P> = React.ComponentType<P>>(Component: C) => C;
