import { ResourceService, Resources } from '..';
export declare type ResourceHookType = (keys: string[]) => Resources;
export declare const createResourceHookInstance: (resourceService: ResourceService) => ResourceHookType;
