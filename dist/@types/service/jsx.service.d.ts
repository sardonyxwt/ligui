import * as React from 'react';
export interface CommonProps {
    id?: string;
    className?: string;
    style?: React.CSSProperties;
}
export interface ChildrenProps<T extends any | any[] = React.ReactNode> {
    children?: T extends (infer U)[] ? U | U[] : T;
}
export declare type DOMEvent = MouseEvent | KeyboardEvent | TouchEvent | React.MouseEvent | React.TouchEvent | React.KeyboardEvent;
export interface JSXService {
    registerFactory<T extends {}>(name: string, factory: React.Factory<T>): void;
    node<T extends {}>(name: string, props?: T, ...children: React.ReactNode[]): React.ReactElement<T>;
    render<T extends {}>(container: Element, element: React.ReactElement<T>): any;
    hydrate<T extends {}>(container: Element, element: React.ReactElement<T>): any;
    renderComponent<T extends {}>(container: Element, name: string, props?: T, ...children: React.ReactNode[]): void;
    hydrateComponent<T extends {}>(container: Element, name: string, props?: T, ...children: React.ReactNode[]): void;
    classes(...classes: (string | [string, boolean])[]): string;
    eventTrap(evt: DOMEvent, includeNative?: boolean): void;
    isModifiedEvent(evt: DOMEvent): boolean;
    mergeRefs<T>(...refs: Array<React.Ref<T>>): (ref: T) => void;
}
export declare const classes: (...classes: (string | [string, boolean])[]) => string;
export declare const eventTrap: (evt: DOMEvent, includeNative?: boolean) => void;
export declare const isModifiedEvent: (evt: DOMEvent) => boolean;
export declare const mergeRefs: <T>(...refs: React.Ref<T>[]) => (ref: T) => void;
export declare class JSXServiceImpl implements JSXService {
    private _factories;
    classes: (...classes: (string | [string, boolean])[]) => string;
    eventTrap: (evt: DOMEvent, includeNative?: boolean) => void;
    isModifiedEvent: (evt: DOMEvent) => boolean;
    mergeRefs: <T>(...refs: React.Ref<T>[]) => (ref: T) => void;
    hydrate<T extends {}>(container: Element, element: React.ReactElement<T>): void;
    hydrateComponent<T extends {}>(container: Element, name: string, props?: T, ...children: React.ReactNode[]): void;
    node<T extends {}>(name: string, props?: T, ...children: React.ReactNode[]): React.ReactElement<T>;
    registerFactory<T extends {}>(name: string, factory: React.Factory<T>): void;
    render<T extends {}>(container: Element, element: React.ReactElement<T>): void;
    renderComponent<T extends {}>(container: Element, name: string, props?: T, ...children: React.ReactNode[]): void;
}
//# sourceMappingURL=jsx.service.d.ts.map