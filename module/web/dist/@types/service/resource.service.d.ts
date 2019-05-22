import { ScopeListener } from '@sardonyxwt/state-store';
import { Resources, ResourceScope, ResourceScopeAddons, ResourceScopeAddResourceActionProps, ResourceScopeState } from '../scope/resource.scope';
export declare type ResourceLoader = (key: string) => any | Promise<any>;
export interface ResourceService extends ResourceScopeAddons {
    loadResources(keys: string[]): Promise<Resources>;
}
export declare class ResourceServiceImpl implements ResourceService {
    private _loader;
    private _scope;
    private _resourcePromises;
    constructor(_loader: ResourceLoader, _scope: ResourceScope);
    readonly resources: Resources;
    getResource(key: string): any;
    setResource(props: ResourceScopeAddResourceActionProps): void;
    isResourcesLoaded(keys: string[]): boolean;
    onSetResource(listener: ScopeListener<ResourceScopeState>): import("@sardonyxwt/state-store").ScopeListenerUnsubscribeCallback;
    loadResources(keys: string[]): Promise<Resources>;
}
