import * as React from 'react';
import * as History from 'history';
import {
    Route as BrowserRoute,
    useHistory as useBrowserHistory,
    useLocation as useBrowserLocation,
    useParams as useBrowserParams,
    useRouteMatch as useBrowserRouteMatch
} from 'react-router-dom';
import {
    Route as MemoryRoute,
    RouteProps,
    RouteChildrenProps,
    RouteComponentProps,
    useHistory as useMemoryHistory,
    useLocation as useMemoryLocation,
    useParams as useMemoryParams,
    useRouteMatch as useMemoryRouteMatch
} from 'react-router';
import { useRouterType } from './router.component';

export const RouteContext = React.createContext<RouteComponentProps<any>>(null);

export function useHistory<HistoryLocationState = History.LocationState>() {
    return useRouterType() === 'browser'
        ? useBrowserHistory<HistoryLocationState>()
        : useMemoryHistory<HistoryLocationState>();
}

export function useLocation<LocationState = History.LocationState>() {
    return useRouterType() === 'browser'
        ? useBrowserLocation<LocationState>()
        : useMemoryLocation<LocationState>();
}

export function useParams<Params extends { [K in keyof Params]?: string } = {}>() {
    return useRouterType() === 'browser'
        ? useBrowserParams<Params>()
        : useMemoryParams<Params>();
}

export function useRouteMatch<Params extends { [K in keyof Params]?: string } = {}>(
    path?: string | string[] | RouteProps
) {
    return useRouterType() === 'browser'
        ? useBrowserRouteMatch<Params>(path)
        : useMemoryRouteMatch<Params>(path);
}

export function Route(
    {
        render,
        component,
        children,
        ...routeProps
    }: RouteProps
) {
    const ReactRoute = useRouterType() === 'browser' ? BrowserRoute : MemoryRoute;

    return (
        <ReactRoute {...routeProps}>
            {
                (routeChildrenProps: RouteChildrenProps) => (
                    <RouteContext.Provider value={routeChildrenProps}>
                        {children || render(routeChildrenProps) || React.createElement(component)}
                    </RouteContext.Provider>
                )
            }
        </ReactRoute>
    );
}
