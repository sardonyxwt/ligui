import { Context } from '@src/context';
import { Resources } from '@src/scope/resource.scope';
export declare type ResourcesHookType = (context: Context, keys: string[]) => Resources;
export declare function useResources(context: Context, keys: string[]): Resources;
