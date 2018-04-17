import { JSXService } from './service/jsx.service';
import { RestService } from './service/rest.service';
import { StoreService } from './service/store.service';
import { ConfigService } from './service/config.service';
import { ResourceService } from './service/resource.service';
import { NavigationService } from './service/navigation.service';
import { LocalizationService } from './service/localization.service';
export interface Ligui {
    jsx: JSXService;
    rest: RestService;
    store: StoreService;
    config: ConfigService;
    resource: ResourceService;
    navigation: NavigationService;
    localization: LocalizationService;
}
export declare const ligui: Ligui;
