export declare abstract class JSXService {
    protected components: {};
    register(name: string, component: any): this;
    remove(query: string): void;
    abstract render(query: string, component: any, isReplaced?: boolean): JSXService;
    abstract create(name: string, props?: {}, children?: JSX.Element | JSX.Element[]): any;
}
