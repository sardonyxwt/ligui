import * as React from 'react';
import { ChildrenProps } from '../service/jsx.service';
export declare type RouterType = 'memory' | 'browser';
export declare const RouterContext: React.Context<RouterType>;
export declare function useRouterType(): RouterType;
export declare type RouterProps = ChildrenProps & {
    ssrInitialPath?: string;
};
export declare function Router({ ssrInitialPath, children }: RouterProps): JSX.Element;
//# sourceMappingURL=router.component.d.ts.map