import * as React from 'react';
import * as History from 'history';
import { RouteProps, RouteComponentProps } from 'react-router';
declare let RouteContext: React.Context<RouteComponentProps<any>>;
export { RouteContext };
export declare function useHistory<HistoryLocationState = History.LocationState>(): History.History<HistoryLocationState>;
export declare function useLocation<LocationState = History.LocationState>(): History.Location<LocationState>;
export declare function useParams<Params extends {
    [K in keyof Params]?: string;
} = {}>(): { [p in keyof Params]: string; };
export declare function useRouteMatch<Params extends {
    [K in keyof Params]?: string;
} = {}>(path?: string | string[] | RouteProps): import("react-router").match<Params>;
export declare function Route({ render, component, children, ...routeProps }: RouteProps): JSX.Element;
//# sourceMappingURL=route.component.d.ts.map