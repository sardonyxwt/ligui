import { context, ContextHOCInjectedProps } from './hoc/context.hoc';
import { subscribe, SubscribeScopeSetting } from './hoc/subscribe.hoc';
import { resource, ResourceHOCInjectedProps } from './hoc/resource.hoc';
import { localization, LocalizationHOCInjectedProps } from './hoc/localization.hoc';
import { JSXService } from './service/jsx.service';
import { RestService } from './service/rest.service';
import { StoreService } from './service/store.service';
import { ResourceService } from './service/resource.service';
import { LocalizationService } from './service/localization.service';
import { ToastApi } from './api/toast.api';
import { DialogApi } from './api/dialog.api';
import { ContextmenuApi } from './api/contextmenu.api';
import { NotificationApi } from './api/notification.api';
import { entity, Builder, EntityHelper } from './extension/entity';
import { Converter, DoubleSidedConverter } from './extension/converter';
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
export interface Ligui {
    readonly jsx: JSXService;
    readonly rest: RestService;
    readonly store: StoreService;
    readonly resource: ResourceService;
    readonly localization: LocalizationService;
    readonly api: LiguiApi;
    readonly isConfigured: boolean;
    setup(config: LiguiConfig): void;
}
declare const ligui: Ligui;
export { ligui, JSXService, RestService, StoreService, ToastApi, DialogApi, ContextmenuApi, NotificationApi, context, subscribe, resource, localization, entity, Builder, EntityHelper, ContextHOCInjectedProps, SubscribeScopeSetting, ResourceHOCInjectedProps, LocalizationHOCInjectedProps, Converter, DoubleSidedConverter };
