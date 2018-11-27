import * as React from 'react';
export interface JSXService {
    registerFactory<T extends {}>(name: string, factory: React.Factory<T>): JSXService;
    node<T extends {}>(name: string, props?: T, ...children: React.ReactNode[]): React.ReactElement<T>;
    render<T extends {}>(container: Element, element: React.ReactElement<T>): any;
    renderComponent<T extends {}>(container: Element, name: string, props?: T, ...children: React.ReactNode[]): void;
    ['render*']?(container: Element, props?: any, children?: React.ReactNode[]): void;
    classes(classes: (string | [string, boolean])[]): string;
}
export declare const jsxService: JSXService;
