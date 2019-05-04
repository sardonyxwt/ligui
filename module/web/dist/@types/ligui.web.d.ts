import 'reflect-metadata';
import { Context } from './context';
import { Generator } from '@sardonyxwt/utils/generator';
import { DeferredCall } from './extension/function';
import { Parameters, ReturnType } from './extension/data';
import { JSXService } from './service/jsx.service';
import { RestService } from './service/rest.service';
import { StoreService } from './service/store.service';
import { EventBusService } from './service/event-bus.service';
import { ResourceService } from './service/resource.service';
import { LocalizationService } from './service/localization.service';
import { DependencyHookType, DependenciesHookType } from './hook/dependency.hook';
import { IdHookType } from './hook/id.hook';
import { LocalizationHookType } from './hook/localization.hook';
import { RefHookType } from './hook/ref.hook';
import { ResourcesHookType } from './hook/resources.hook';
import { StateHookType } from './hook/state.hook';
import { PocketHookType } from './hook/pocket.hook';
import { ToastApi } from './api/toast.api';
import { DialogApi } from './api/dialog.api';
import { PreloaderApi } from './api/preloader.api';
import { ContextmenuApi } from './api/contextmenu.api';
import { NotificationApi } from './api/notification.api';
import { ResourcePartLoader } from './loader/resource.loader';
import { LocalizationPartLoader } from './loader/localization.loader';
import { ResourceScopeOptions } from './scope/resource.scope';
import { LocalizationScopeOptions } from './scope/localization.scope';
import { StoreDevTool } from '@sardonyxwt/state-store';
import { EventBusDevTool } from '@sardonyxwt/event-bus';
import { interfaces } from 'inversify';
export * from 'inversify';
export * from './types';
export * from './context';
export * from './api/contextmenu.api';
export * from './api/dialog.api';
export * from './api/notification.api';
export * from './api/preloader.api';
export * from './api/toast.api';
export * from './extension/converter';
export * from './extension/entity';
export * from './extension/data';
export * from './extension/function';
export * from './scope/localization.scope';
export * from './scope/resource.scope';
export * from './loader/localization.loader';
export * from './loader/resource.loader';
export * from './service/jsx.service';
export * from './service/localization.service';
export * from './service/resource.service';
export * from './service/rest.service';
export * from './service/store.service';
export * from './hook/dependency.hook';
export * from './hook/id.hook';
export * from './hook/localization.hook';
export * from './hook/resources.hook';
export * from './hook/state.hook';
export * from './hook/pocket.hook';
export * from './hook/ref.hook';
export * from '@sardonyxwt/state-store';
export * from '@sardonyxwt/event-bus';
export * from '@sardonyxwt/utils/generator';
export * from '@sardonyxwt/utils/object';
export interface LiguiApi {
    toast?: ToastApi;
    dialog?: DialogApi;
    preloader?: PreloaderApi;
    contextmenu?: ContextmenuApi;
    notification?: NotificationApi;
}
export interface LiguiConfig {
    name: string;
    api?: LiguiApi;
    containerOptions: interfaces.ContainerOptions;
    resourcePartLoader: ResourcePartLoader;
    resourceScopeOptions: ResourceScopeOptions;
    localizationPartLoader: LocalizationPartLoader;
    localizationScopeOptions: LocalizationScopeOptions;
    storeDevTools?: Partial<StoreDevTool>;
    eventBusDevTools?: Partial<EventBusDevTool>;
}
export interface Ligui {
    readonly jsx: JSXService;
    readonly rest: RestService;
    readonly store: StoreService;
    readonly eventBus: EventBusService;
    readonly resource: ResourceService;
    readonly localization: LocalizationService;
    readonly api: LiguiApi;
    readonly context: Context;
    useId: IdHookType;
    useDependency: DependencyHookType;
    useDependencies: DependenciesHookType;
    useLocalization: LocalizationHookType;
    useResources: ResourcesHookType;
    useState: StateHookType;
    useRef: RefHookType;
    usePocket: PocketHookType;
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
export declare function createNewLiguiInstance(config: LiguiConfig, postInstall?: (ligui: Ligui) => void): Ligui;
