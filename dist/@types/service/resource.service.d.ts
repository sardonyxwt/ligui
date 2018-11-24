import { ResourceScopeAddons } from '../scope/resource.scope';
import { ResourceLoader } from '../loader/resource.loader';
export interface ResourceService extends ResourceScopeAddons, ResourceLoader {
}
export declare const resourceService: ResourceService;
