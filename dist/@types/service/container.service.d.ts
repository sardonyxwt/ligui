import { Container, decorate } from 'inversify';
export interface Newable<T> {
    new (...args: any[]): T;
}
export interface Abstract<T> {
    prototype: T;
}
export declare type ContainerKey = string | number | symbol;
export declare type ContainerId<T = any> = string | symbol | Newable<T> | Abstract<T>;
export declare enum LiguiTypes {
    JSX_SERVICE = "LIG_JSX_SERVICE",
    REST_SERVICE = "LIG_REST_SERVICE",
    STORE_SERVICE = "LIG_STORE_SERVICE",
    RESOURCE_SERVICE = "LIG_RESOURCE_SERVICE",
    LOCALIZATION_SERVICE = "LIG_LOCALIZATION_SERVICE",
    CONTAINER_SERVICE = "LIG_CONTAINER_SERVICE",
    TOAST_API = "LIG_TOAST_API",
    DIALOG_API = "LIG_DIALOG_API",
    CONTEXTMENU_API = "LIG_CONTEXTMENU_API",
    NOTIFICATION_API = "LIG_NOTIFICATION_API"
}
export interface ContainerService {
    readonly container: Container;
    resolve<T = any>(id: ContainerId): T;
    resolveNamed<T = any>(id: ContainerId, name: ContainerKey): T;
    resolveTagged<T = any>(id: ContainerId, key: ContainerKey, value: any): T;
    resolveAll<T = any>(id: ContainerId): T[];
    resolveAllNamed<T = any>(id: ContainerId, name: ContainerKey): T[];
    resolveAllTagged<T = any>(id: ContainerId, key: ContainerKey, value: any): T[];
    decorate(decorator: (ClassDecorator | ParameterDecorator | MethodDecorator), target: any, parameterIndex?: number | string): void;
}
export declare const containerService: Readonly<{
    resolve<T = any>(id: ContainerId<any>): T;
    resolveNamed<T = any>(id: ContainerId<any>, name: string | number | symbol): T;
    resolveTagged<T = any>(id: ContainerId<any>, key: string | number | symbol, value: any): T;
    resolveAll<T = any>(id: ContainerId<any>): T[];
    resolveAllNamed<T = any>(id: ContainerId<any>, name: string | number | symbol): T[];
    resolveAllTagged<T = any>(id: ContainerId<any>, key: string | number | symbol, value: any): T[];
    decorate: typeof decorate;
    readonly container: Container;
}>;
