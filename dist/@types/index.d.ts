export * from 'inversify';
export * from './api/contextmenu.api';
export * from './api/dialog.api';
export * from './api/notification.api';
export * from './api/preloader.api';
export * from './api/toast.api';
export * from './extension/converter';
export * from './extension/entity';
export * from './scope/localization.scope';
export * from './scope/resource.scope';
export * from './loader/localization.loader';
export * from './loader/resource.loader';
export * from './service/jsx.service';
export * from './service/localization.service';
export * from './service/resource.service';
export * from './service/rest.service';
export * from './service/store.service';
export * from './service/container.service';
export * from './hook/dependency.hook';
export * from './hook/id.hook';
export * from './hook/localization.hook';
export * from './hook/resources.hook';
export * from './hook/state.hook';
export * from './hook/ref.hook';
export * from './hoc/context.hoc';
export * from './hoc/state.hoc';
export * from './hoc/resources.hoc';
export * from './hoc/localization.hoc';
export * from '@sardonyxwt/state-store';
export * from '@sardonyxwt/event-bus';
export * from '@sardonyxwt/utils/generator';
export * from '@sardonyxwt/utils/object';
import 'reflect-metadata';
import { Generator } from '@sardonyxwt/utils/generator';
import { JSXService } from './service/jsx.service';
import { RestService } from './service/rest.service';
import { StoreService } from './service/store.service';
import { EventBusService } from './service/event-bus.service';
import { ResourceService } from './service/resource.service';
import { ContainerService } from './service/container.service';
import { LocalizationService } from './service/localization.service';
import { DependencyHookType, DependenciesHookType } from './hook/dependency.hook';
import { IdHookType } from './hook/id.hook';
import { LocalizationHookType } from './hook/localization.hook';
import { RefHookType } from './hook/ref.hook';
import { ResourcesHookType } from './hook/resources.hook';
import { StateHookType } from './hook/state.hook';
import { ContextHocType } from './hoc/context.hoc';
import { StateHocType } from './hoc/state.hoc';
import { ResourcesHocType } from './hoc/resources.hoc';
import { LocalizationHocType } from './hoc/localization.hoc';
import { ToastApi } from './api/toast.api';
import { DialogApi } from './api/dialog.api';
import { PreloaderApi } from './api/preloader.api';
import { ContextmenuApi } from './api/contextmenu.api';
import { NotificationApi } from './api/notification.api';
import { RLoader } from './loader/resource.loader';
import { LLoader } from './loader/localization.loader';
import { ResourceScopeConfigureActionProps } from './scope/resource.scope';
import { LocalizationScopeConfigureActionProps } from './scope/localization.scope';
import { StoreDevTool } from '@sardonyxwt/state-store';
import { EventBusDevTool } from '@sardonyxwt/event-bus';
export interface LiguiConfig {
    api?: LiguiApi;
    globalName?: string;
    resourceLoader?: RLoader;
    resourceInitState?: ResourceScopeConfigureActionProps;
    localizationLoader?: LLoader;
    localizationInitState?: LocalizationScopeConfigureActionProps;
    storeDevTools?: Partial<StoreDevTool>;
    eventBusDevTools?: Partial<EventBusDevTool>;
    restDefaultProps?: RequestInit;
}
export interface LiguiApi {
    toast?: ToastApi;
    dialog?: DialogApi;
    preloader?: PreloaderApi;
    contextmenu?: ContextmenuApi;
    notification?: NotificationApi;
}
export interface LiguiHoc {
    withContext: ContextHocType;
    withLocalization: LocalizationHocType;
    withResources: ResourcesHocType;
    withState: StateHocType;
}
export interface LiguiHook {
    useId: IdHookType;
    useDependency: DependencyHookType;
    useDependencies: DependenciesHookType;
    useLocalization: LocalizationHookType;
    useResources: ResourcesHookType;
    useState: StateHookType;
    useRef: RefHookType;
}
export interface Ligui extends ContainerService, LiguiHoc, LiguiHook {
    readonly jsx: JSXService;
    readonly rest: RestService;
    readonly store: StoreService;
    readonly eventBus: EventBusService;
    readonly resource: ResourceService;
    readonly localization: LocalizationService;
    readonly api: LiguiApi;
    readonly hoc: LiguiHoc;
    readonly hook: LiguiHook;
    clone: <T>(source: T) => T;
    cloneArray: <T>(sources: T[]) => T[];
    cloneArrays: <T>(...sources: (T[])[]) => T[];
    copyArray: <T>(sources: T[]) => T[];
    copyArrays: <T>(...sources: (T[])[]) => T[];
    resolveArray: <T>(source: T | T[]) => T[];
    arrayFrom: <T>(...sources: (T | T[])[]) => T[];
    generateUUID: Generator<string>;
    generateSalt: Generator<string>;
    flatten(data: object): object;
    unflatten(data: object): object;
    stringifyValue(value: any): string;
    deepFreeze<T>(obj: T): Readonly<T>;
    resolveFunctionCall<T extends Function>(func: T, ...flags: boolean[]): T;
    prepareFunctionCall<T extends Function>(func: T, ...flags: boolean[]): ((...args: Parameters<typeof func>) => () => ReturnType<typeof func>);
    createUniqueIdGenerator(prefix: string): Generator<string>;
    charFromHexCode(hexCode: string): string;
}
export declare let ligui: Ligui;
export declare type Parameters<T> = T extends (...args: infer T) => any ? T : never;
export declare type ReturnType<T> = T extends (...args: any[]) => infer T ? T : never;
export declare const resolveFunctionCall: <T extends Function>(func: T, ...flags: boolean[]) => T;
export declare const prepareFunctionCall: <T extends Function>(func: T, ...flags: boolean[]) => (...args: Parameters<T>) => () => ReturnType<T>;
export declare const charFromHexCode: (hexCode: any) => string;
export declare function setupLigui(config: LiguiConfig): void;
