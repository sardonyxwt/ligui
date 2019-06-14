import 'reflect-metadata';
import { Context } from './context';
import { Generator } from '@sardonyxwt/utils/generator';
import { DeferredCall } from './extension/function.extension';
import { Parameters, ReturnType } from './extension/data.extension';
import { RestService } from './service/rest.service';
import { StoreService } from './service/store.service';
import { EventBusService } from './service/event-bus.service';
import { ResourceService, ResourceLoader } from './service/resource.service';
import { LocalizationService, LocalizationLoader } from './service/localization.service';
import { ModuleService, ModuleLoader } from './service/module.service';
import { ResourceScopeOptions } from './scope/resource.scope';
import { LocalizationScopeOptions } from './scope/localization.scope';
import { ModuleScopeOptions } from './scope/module.scope';
import { Store, StoreDevTool } from '@sardonyxwt/state-store';
import { EventBusDevTool } from '@sardonyxwt/event-bus';
import { Container, interfaces } from 'inversify';
export * from 'inversify';
export * from './types';
export * from './context';
export * from './extension/converter.extension';
export * from './extension/entity.extension';
export * from './extension/data.extension';
export * from './extension/function.extension';
export * from './scope/module.scope';
export * from './scope/resource.scope';
export * from './scope/localization.scope';
export * from './service/localization.service';
export * from './service/resource.service';
export * from './service/rest.service';
export * from './service/store.service';
export * from './service/module.service';
export * from '@sardonyxwt/state-store';
export * from '@sardonyxwt/event-bus';
export * from '@sardonyxwt/utils/generator';
export * from '@sardonyxwt/utils/object';
export interface NodeLiguiConfig {
    name: string;
    containerOptions: interfaces.ContainerOptions;
    resourceLoader: ResourceLoader;
    resourceScopeOptions: ResourceScopeOptions;
    localizationLoader: LocalizationLoader;
    localizationScopeOptions: LocalizationScopeOptions;
    moduleLoader: ModuleLoader;
    moduleScopeOptions: ModuleScopeOptions;
    storeDevTools?: Partial<StoreDevTool>;
    eventBusDevTools?: Partial<EventBusDevTool>;
}
export interface NodeLigui extends StoreService, EventBusService {
    readonly rest: RestService;
    readonly resource: ResourceService;
    readonly localization: LocalizationService;
    readonly module: ModuleService;
    readonly context: Context;
    readonly store: Store;
    readonly container: Container;
    clone: <T>(source: T) => T;
    cloneArray: <T>(sources: T[]) => T[];
    cloneArrays: <T>(...sources: (T[])[]) => T[];
    copyArray: <T>(sources: T[]) => T[];
    copyArrays: <T>(...sources: (T[])[]) => T[];
    resolveArray: <T>(source: T | T[]) => T[];
    arrayFrom: <T>(...sources: (T | T[])[]) => T[];
    generateUUID: Generator<string>;
    generateSalt: Generator<string>;
    createUniqueIdGenerator: (prefix: string) => Generator<string>;
    flatten: (data: object) => object;
    unflatten: (data: object) => object;
    stringifyValue: (value: any) => string;
    deepFreeze: <T>(obj: T) => Readonly<T>;
    deferred: DeferredCall;
    charFromHexCode: (hexCode: string) => string;
    resolveFunctionCall: <T extends Function>(func: T, ...flags: boolean[]) => T;
    prepareFunctionCall: <T extends Function>(func: T, ...flags: boolean[]) => ((...args: Parameters<typeof func>) => () => ReturnType<typeof func>);
}
export declare function createNewLiguiInstance(config: NodeLiguiConfig): NodeLigui;
