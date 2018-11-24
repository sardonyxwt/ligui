import { Resources } from '..';
export declare type RLoader = (key: string) => any | Promise<any>;
export interface ResourceLoader {
    loader: RLoader;
    loadResources(keys: string[]): Promise<Resources>;
}
export declare const resourceLoader: ResourceLoader;
