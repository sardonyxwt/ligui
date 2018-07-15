import { JSXService } from './service/jsx.service';
import { RestService } from './service/rest.service';
import { StoreService } from './service/store.service';
import { ConfigService } from './service/config.service';
import { ResourceService } from './service/resource.service';
import { NavigationService } from './service/navigation.service';
import { LocalizationService } from './service/localization.service';
import { ToastApi } from './api/toast.api';
import { DialogApi } from './api/dialog.api';
import { ContextmenuApi } from './api/contextmenu.api';
import { NotificationApi } from './api/notification.api';
export { ToastApi, DialogApi, ContextmenuApi, NotificationApi };
export interface Ligui {
    jsx: JSXService;
    rest: RestService;
    store: StoreService;
    config: ConfigService;
    resource: ResourceService;
    navigation: NavigationService;
    localization: LocalizationService;
    api: {
        toast?: ToastApi;
        dialog?: DialogApi;
        contextmenu?: ContextmenuApi;
        notification?: NotificationApi;
    };
}
export declare const ligui: Ligui;
