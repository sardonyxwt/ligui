import { ScopeListener, Scope, Store, ScopeListenerUnsubscribeCallback } from '@sardonyxwt/state-store';
export declare const RESOURCE_SCOPE_NAME = "resource";
export declare const RESOURCE_SCOPE_SET_RESOURCE_ACTION = "setResource";
export interface Resources {
    [key: string]: any;
}
export interface ResourceScopeState {
    readonly resources: Resources;
}
export interface ResourceScopeAddResourceActionProps {
    key: string;
    resource: any;
}
export interface ResourceScopeAddons extends ResourceScopeState {
    setResource(props: ResourceScopeAddResourceActionProps): void;
    getResource(key: string): any;
    isResourceLoaded(key: string): boolean;
    onSetResource(listener: ScopeListener<ResourceScopeState>): ScopeListenerUnsubscribeCallback;
}
export interface ResourceScope extends Scope<ResourceScopeState>, ResourceScopeAddons {
}
export interface ResourceScopeOptions {
    initState: ResourceScopeState;
}
export declare function createResourceScope(store: Store, { initState }: ResourceScopeOptions): ResourceScope;
