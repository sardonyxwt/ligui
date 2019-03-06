import { ResourceLoader, ResourceScopeAddons } from '..';
export interface ResourceService extends ResourceScopeAddons, ResourceLoader {
}
export declare function createResourceServiceInstance(): ResourceService;
