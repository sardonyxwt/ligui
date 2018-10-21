import { context } from 'hoc/context.hoc';
import { connect } from 'hoc/connect.hoc';
import { localization } from 'hoc/localization.hoc';
import { JSXService } from 'service/jsx.service';
import { RestService } from 'service/rest.service';
import { StoreService } from 'service/store.service';
import { ResourceService } from 'service/resource.service';
import { LocalizationService } from 'service/localization.service';
import { ToastApi } from 'api/toast.api';
import { DialogApi } from 'api/dialog.api';
import { ContextmenuApi } from 'api/contextmenu.api';
import { NotificationApi } from 'api/notification.api';
export * from 'decorator/router.decorator';
export interface Ligui {
    jsx: JSXService;
    rest: RestService;
    store: StoreService;
    resource: ResourceService;
    localization: LocalizationService;
    api: {
        toast?: ToastApi;
        dialog?: DialogApi;
        contextmenu?: ContextmenuApi;
        notification?: NotificationApi;
    };
}
declare const ligui: Ligui;
export { ligui, JSXService, RestService, StoreService, ResourceService, LocalizationService, ToastApi, DialogApi, ContextmenuApi, NotificationApi, context, connect, localization };
