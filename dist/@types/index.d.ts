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
export * from './hoc/context.hoc';
export * from './hoc/state.hoc';
export * from './hoc/resources.hoc';
export * from './hoc/localization.hoc';
export * from '@sardonyxwt/state-store';
export * from '@sardonyxwt/event-bus';
export * from '@sardonyxwt/utils/generator';
export * from '@sardonyxwt/utils/json';
import 'reflect-metadata';
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
import { ResourceHookType } from './hook/resources.hook';
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
    id?: string;
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
    context: ContextHocType;
    localization: LocalizationHocType;
    resources: ResourcesHocType;
    state: StateHocType;
}
export interface LiguiHook {
    id: IdHookType;
    dependency: DependencyHookType;
    dependencies: DependenciesHookType;
    localization: LocalizationHookType;
    resource: ResourceHookType;
    state: StateHookType;
}
export interface Ligui extends ContainerService {
    readonly id: string;
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
    flatten(data: object): object;
    unflatten(data: object): object;
    uniqueId(prefix?: any, useSeed?: any): string;
}
export declare function getLiguiInstance(id: string): Ligui;
export declare function getAllLiguiInstance(): Ligui[];
export declare function createLiguiInstance(config: LiguiConfig): Ligui;
