import * as React from 'react';
export interface JSXService {
    registerFactory<T extends {}>(name: string, factory: React.Factory<T>): JSXService;
    node<T>(name: string, props: T, children?: React.ReactNode[]): React.ReactElement<T>;
    render<T>(container: Element, element: React.ReactElement<T>): any;
}
export declare const jsxService: JSXService;
