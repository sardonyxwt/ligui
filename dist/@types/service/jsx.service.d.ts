import { AnyComponent } from 'preact';
export declare class JSXService {
    private components;
    private static instance;
    private constructor();
    static readonly INSTANCE: JSXService;
    register(name: string, component: AnyComponent<any, any>): this;
    render(query: string, component: JSX.Element, isReplaced?: boolean): this;
    renderToString(el: JSX.Element): string;
    remove(query: string): void;
    create(name: string, props?: {}, children?: JSX.Element | JSX.Element[]): JSX.Element;
}
