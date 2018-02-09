import { AnyComponent } from 'preact';
export declare class JSXService {
    private static instance;
    private components;
    private constructor();
    static readonly INSTANCE: JSXService;
    register(name: string, component: AnyComponent<any, any>): this;
    render(query: string, component: JSX.Element, isReplaced?: boolean): this;
    renderToString(component: JSX.Element): void;
    remove(query: string): void;
    create(name: string, props?: {}, children?: JSX.Element | JSX.Element[]): JSX.Element;
}
