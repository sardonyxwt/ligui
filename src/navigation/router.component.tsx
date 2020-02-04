import * as React from 'react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { Route } from './route.component';
import { ChildrenProps } from '../service/jsx.service';

export type RouterType = 'memory' | 'browser';

export const RouterContext = React.createContext<RouterType>(null);

export function useRouterType(): RouterType {
    return React.useContext(RouterContext);
}

export type RouterProps = ChildrenProps & {
    ssrInitialPath?: string;
}

export function Router({ssrInitialPath, children}: RouterProps) {
    const renderLayoutWithProviders = (type: RouterType) => (
        <RouterContext.Provider value={type}>
            <Route>
                {children}
            </Route>
        </RouterContext.Provider>
    );

    return ssrInitialPath ? (
        <MemoryRouter initialEntries={[ssrInitialPath]}>
            {renderLayoutWithProviders('memory')}
        </MemoryRouter>
    ) : (
        <BrowserRouter>
            {renderLayoutWithProviders('browser')}
        </BrowserRouter>
    );
}
