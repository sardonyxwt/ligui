import { AnyComponent } from 'preact';
export interface JSXService {
    register(name: string, component: AnyComponent<any, any>): JSXService;
    render(query: string, component: JSX.Element, isReplaced?: boolean): JSXService;
    create(name: string, props?: {}, children?: JSX.Element | JSX.Element[]): JSX.Element;
    remove(query: string): any;
}
export declare const jsxService: JSXService;
export { h, render, Component, AnyComponent, ComponentProps, ComponentLifecycle, FunctionalComponent, ComponentConstructor } from 'preact';
