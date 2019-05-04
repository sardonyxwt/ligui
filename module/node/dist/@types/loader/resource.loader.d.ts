import { Resources, ResourceScope } from '../scope/resource.scope';
export declare type ResourcePartLoader = (key: string) => any | Promise<any>;
export declare type ResourceLoader = (keys: string[]) => Promise<Resources>;
export declare function createResourceLoader(resourceScope: ResourceScope, loader: ResourcePartLoader): ResourceLoader;
