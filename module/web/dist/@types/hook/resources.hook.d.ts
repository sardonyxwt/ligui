import { Context } from '../context';
import { Resources } from '../scope/resource.scope';
export declare type ResourcesHookType = (context: Context, keys: string[]) => Resources;
export declare function useResources(context: Context, keys: string[]): Resources;
