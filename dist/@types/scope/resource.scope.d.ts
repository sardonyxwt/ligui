import { ScopeEvent, SyncScope } from '@sardonyxwt/state-store';
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
    onConfigure(e: ScopeEvent<ResourceScopeState>): any;
    onSetResource(e: ScopeEvent<ResourceScopeState>): any;
}
export interface ResourceScope extends SyncScope<ResourceScopeState>, ResourceScopeAddons {
}
export declare const resourceScope: ResourceScope;
