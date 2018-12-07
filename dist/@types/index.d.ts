export * from 'inversify';
export * from './api/contextmenu.api';
export * from './api/dialog.api';
export * from './api/notification.api';
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
import 'reflect-metadata';
import { JSXService } from './service/jsx.service';
import { RestService } from './service/rest.service';
import { StoreService } from './service/store.service';
import { ResourceService } from './service/resource.service';
import { ContainerService } from './service/container.service';
import { LocalizationService } from './service/localization.service';
import { ToastApi } from './api/toast.api';
import { DialogApi } from './api/dialog.api';
import { ContextmenuApi } from './api/contextmenu.api';
import { NotificationApi } from './api/notification.api';
import { RLoader } from './loader/resource.loader';
import { LLoader } from './loader/localization.loader';
import { ResourceScopeConfigureActionProps } from './scope/resource.scope';
import { LocalizationScopeConfigureActionProps } from './scope/localization.scope';
import { StoreDevTool } from '@sardonyxwt/state-store';
export interface LiguiConfig {
    api?: LiguiApi;
    globalName?: string;
    resourceLoader?: RLoader;
    resourceInitState?: ResourceScopeConfigureActionProps;
    localizationLoader?: LLoader;
    localizationInitState?: LocalizationScopeConfigureActionProps;
    storeDevTools?: Partial<StoreDevTool>;
}
export interface LiguiApi {
    toast?: ToastApi;
    dialog?: DialogApi;
    contextmenu?: ContextmenuApi;
    notification?: NotificationApi;
}
export interface Ligui extends ContainerService {
    readonly jsx: JSXService;
    readonly rest: RestService;
    readonly store: StoreService;
    readonly resource: ResourceService;
    readonly localization: LocalizationService;
    readonly api: LiguiApi;
    readonly isConfigured: boolean;
    clone: <T>(source: T) => T;
    cloneArray: <T>(sources: T[]) => T[];
    cloneArrays: <T>(...sources: (T[])[]) => T[];
    copyArray: <T>(sources: T[]) => T[];
    copyArrays: <T>(...sources: (T[])[]) => T[];
    resolveArray: <T>(source: T | T[]) => T[];
    arrayFrom: <T>(...sources: (T | T[])[]) => T[];
    uniqueId(prefix?: any, useSeed?: any): string;
    setup(config: LiguiConfig): void;
}
export declare const ligui: Ligui;
