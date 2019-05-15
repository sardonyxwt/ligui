import { Resources } from '../scope/resource.scope';
import { ResourceService } from '../service/resource.service';
export declare const createResourceHook: (resourceService: ResourceService) => (keys: string[]) => Resources;
