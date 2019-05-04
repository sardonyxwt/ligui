import { Resources, ResourceScope } from '../scope/resource.scope';
export declare type PartResourceLoader = (key: string) => any | Promise<any>;
export declare type ResourceLoader = (keys: string[]) => Promise<Resources>;
export declare function createResourceLoader(resourceScope: ResourceScope, loader: PartResourceLoader): ResourceLoader;
