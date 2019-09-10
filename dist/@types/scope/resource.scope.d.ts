import { Scope, ScopeListener, ScopeListenerUnsubscribeCallback, Store } from '@sardonyxwt/state-store';
export declare const RESOURCE_SCOPE_NAME = "resource";
export declare const RESOURCE_SCOPE_SET_RESOURCE_ACTION = "setResource";
export interface ResourceId {
    readonly key: string;
    readonly context?: string;
}
export interface Resource<T = any> {
    readonly id: ResourceId;
    readonly data: T;
}
export interface ResourceScopeState {
    readonly resources: Resource[];
}
export interface ResourceScopeExtensions extends ResourceScopeState {
    setResource(resource: Resource): void;
    getResourceData(id: ResourceId): any;
    isResourceLoaded(id: ResourceId): boolean;
    onSetResource(listener: ScopeListener<ResourceScopeState>): ScopeListenerUnsubscribeCallback;
}
export interface ResourceScope extends Scope<ResourceScopeState>, ResourceScopeExtensions {
}
export declare const resourceIdComparator: (id1: ResourceId, id2: ResourceId) => boolean;
export declare function createResourceScope(store: Store, initState?: ResourceScopeState): ResourceScope;
//# sourceMappingURL=resource.scope.d.ts.map