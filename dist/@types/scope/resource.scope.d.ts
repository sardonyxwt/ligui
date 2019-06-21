import { ScopeListener, Scope, Store, ScopeListenerUnsubscribeCallback } from '@sardonyxwt/state-store';
export declare const RESOURCE_SCOPE_NAME = "resource";
export declare const RESOURCE_SCOPE_SET_RESOURCE_ACTION = "setResource";
export interface ResourceIdentifier {
    readonly key: string;
    readonly context: string;
}
export interface Resource<T = any> extends ResourceIdentifier {
    readonly data: T;
}
export interface ResourceScopeState {
    readonly resources: Resource[];
}
export interface ResourceScopeAddons extends ResourceScopeState {
    setResource(resource: Resource): void;
    getResourceData(id: ResourceIdentifier): any;
    isResourceLoaded(id: ResourceIdentifier): boolean;
    onSetResource(listener: ScopeListener<ResourceScopeState>): ScopeListenerUnsubscribeCallback;
}
export interface ResourceScope extends Scope<ResourceScopeState>, ResourceScopeAddons {
}
export interface ResourceScopeOptions {
    initState: ResourceScopeState;
}
export declare const resourceIdComparator: (id1: ResourceIdentifier) => (id2: ResourceIdentifier) => boolean;
export declare function createResourceScope(store: Store, { initState }: ResourceScopeOptions): ResourceScope;
