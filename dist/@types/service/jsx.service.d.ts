import * as React from 'react';
export interface CommonProps {
    className?: string;
    style?: React.CSSProperties;
}
export interface ChildrenProps<T = React.ReactNode> {
    children?: T extends any[] ? T | T[] : T;
}
export interface JSXService {
    registerFactory<T extends {}>(name: string, factory: React.Factory<T>): void;
    node<T extends {}>(name: string, props?: T, ...children: React.ReactNode[]): React.ReactElement<T>;
    render<T extends {}>(container: Element, element: React.ReactElement<T>): any;
    renderComponent<T extends {}>(container: Element, name: string, props?: T, ...children: React.ReactNode[]): void;
    classes(...classes: (string | [string, boolean])[]): string;
    eventTrap(evt: MouseEvent | KeyboardEvent | TouchEvent | React.MouseEvent | React.TouchEvent | React.KeyboardEvent, includeNative?: boolean): void;
    mergeRefs<T>(...refs: Array<React.Ref<T>>): (ref: T) => void;
}
export declare const classes: (...classes: (string | [string, boolean])[]) => string;
export declare const eventTrap: (evt: MouseEvent | KeyboardEvent | TouchEvent | React.MouseEvent<Element, MouseEvent> | React.TouchEvent<Element> | React.KeyboardEvent<Element>, includeNative?: boolean) => void;
export declare const mergeRefs: <T>(...refs: React.Ref<T>[]) => (ref: T) => void;
export declare const jsxService: JSXService;
