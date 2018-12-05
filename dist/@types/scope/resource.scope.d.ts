import { ScopeListener, Scope } from '@sardonyxwt/state-store';
export declare const RESOURCE_SCOPE_NAME = "resource";
export declare const RESOURCE_SCOPE_CONFIGURE_ACTION = "configure";
export declare const RESOURCE_SCOPE_SET_RESOURCE_ACTION = "setResource";
export interface Resources {
    [key: string]: any;
}
export interface ResourceScopeState {
    resources: Resources;
}
export interface ResourceScopeConfigureActionProps extends ResourceScopeState {
}
export interface ResourceScopeAddResourceActionProps {
    key: string;
    resource: any;
}
export interface ResourceScopeAddons {
    readonly resources: Resources;
    readonly isConfigured: boolean;
    configure(props: ResourceScopeState): void;
    setResource(props: ResourceScopeAddResourceActionProps): void;
    getResource(key: string): any;
    isResourcesLoaded(keys: string[]): boolean;
    onConfigure(listener: ScopeListener<ResourceScopeState>): string;
    onSetResource(listener: ScopeListener<ResourceScopeState>): string;
    unsubscribe(id: string): boolean;
}
export interface ResourceScope extends Scope<ResourceScopeState>, ResourceScopeAddons {
}
declare const resourceScope: ResourceScope;
export { resourceScope };
