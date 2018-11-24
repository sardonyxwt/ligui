export * from 'inversify';
export * from './api/contextmenu.api';
export * from './api/dialog.api';
export * from './api/notification.api';
export * from './api/toast.api';
export * from './extension/converter';
export * from './extension/entity';
export * from './hoc/localization.hoc';
export * from './hoc/resource.hoc';
export * from './hoc/subscribe.hoc';
export * from './hoc/context.hoc';
export * from './loader/localization.loader';
export * from './loader/resource.loader';
export * from './scope/localization.scope';
export * from './scope/resource.scope';
export * from './service/jsx.service';
export * from './service/localization.service';
export * from './service/resource.service';
export * from './service/rest.service';
export * from './service/store.service';
import 'reflect-metadata';
import { Container } from 'inversify';
import { JSXService } from './service/jsx.service';
import { RestService } from './service/rest.service';
import { StoreService } from './service/store.service';
import { ResourceService } from './service/resource.service';
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
    storeDevTools?: StoreDevTool;
}
export interface LiguiApi {
    toast?: ToastApi;
    dialog?: DialogApi;
    contextmenu?: ContextmenuApi;
    notification?: NotificationApi;
}
export declare enum LiguiTypes {
    JSX_SERVICE = "LIG_JSX_SERVICE",
    REST_SERVICE = "LIG_REST_SERVICE",
    STORE_SERVICE = "LIG_STORE_SERVICE",
    RESOURCE_SERVICE = "LIG_RESOURCE_SERVICE",
    LOCALIZATION_SERVICE = "LIG_LOCALIZATION_SERVICE",
    TOAST_API = "LIG_TOAST_APIE",
    DIALOG_API = "LIG_DIALOG_API",
    CONTEXTMENU_API = "LIG_CONTEXTMENU_API",
    NOTIFICATION_API = "LIG_NOTIFICATION_API"
}
export interface Ligui {
    readonly jsx: JSXService;
    readonly rest: RestService;
    readonly store: StoreService;
    readonly resource: ResourceService;
    readonly localization: LocalizationService;
    readonly container: Container;
    readonly api: LiguiApi;
    readonly isConfigured: boolean;
    setup(config: LiguiConfig): void;
}
export declare const ligui: Ligui;
