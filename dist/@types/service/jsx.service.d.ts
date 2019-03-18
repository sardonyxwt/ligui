import * as React from 'react';
export interface JSXService {
    registerFactory<T extends {}>(name: string, factory: React.Factory<T>): void;
    node<T extends {}>(name: string, props?: T, ...children: React.ReactNode[]): React.ReactElement<T>;
    render<T extends {}>(container: Element, element: React.ReactElement<T>): any;
    renderComponent<T extends {}>(container: Element, name: string, props?: T, ...children: React.ReactNode[]): void;
    classes(...classes: (string | [string, boolean])[]): string;
    eventTrap(evt: React.MouseEvent | React.TouchEvent | React.KeyboardEvent): void;
}
export declare const classes: (...classes: (string | [string, boolean])[]) => string;
export declare const eventTrap: (evt: React.MouseEvent<Element, MouseEvent> | React.TouchEvent<Element> | React.KeyboardEvent<Element>) => void;
export declare const jsxService: JSXService;
