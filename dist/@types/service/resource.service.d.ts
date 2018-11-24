import { ResourceScope } from '../scope/resource.scope';
import { ResourceLoader } from '../loader/resource.loader';
export interface ResourceService extends ResourceScope, ResourceLoader {
}
export declare const resourceService: ResourceService;
