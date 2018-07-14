/// <reference types="react" />
export interface JSXService {
    register(name: string, component: any): JSXService;
    render(query: string, component: any): JSXService;
    create(name: string, props?: any, children?: JSX.Element | JSX.Element[]): any;
    remove(query: string): JSXService;
}
export declare const jsxService: JSXService;
