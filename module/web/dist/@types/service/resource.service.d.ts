import { ScopeListener } from '@sardonyxwt/state-store';
import { Resources, ResourceScope, ResourceScopeAddons, ResourceScopeAddResourceActionProps, ResourceScopeState } from '../scope/resource.scope';
import { ResourceLoader } from '../loader/resource.loader';
export interface ResourceService extends ResourceScopeAddons {
    loadResources(keys: string[]): Promise<Resources>;
}
export declare class ResourceServiceImpl implements ResourceService {
    private loader;
    private scope;
    constructor(loader: ResourceLoader, scope: ResourceScope);
    readonly resources: Resources;
    getResource(key: string): any;
    setResource(props: ResourceScopeAddResourceActionProps): void;
    isResourcesLoaded(keys: string[]): boolean;
    onSetResource(listener: ScopeListener<ResourceScopeState>): import("@sardonyxwt/state-store").ScopeListenerUnsubscribeCallback;
    loadResources(keys: string[]): Promise<Resources>;
}
