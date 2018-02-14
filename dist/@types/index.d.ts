import * as Store from '@sardonyxwt/state-store';
import * as Utils from './utils';
import { JSXService } from './service/jsx.service';
import { RestService } from './service/rest.service';
import { ConfigService } from './service/config.service';
import { RouterService } from './service/router.service';
import { ResourceService } from './service/resource.service';
import { LocalizationService } from './service/localization.service';
export * from '@sardonyxwt/state-store';
export * from './service/jsx.service';
export * from './service/rest.service';
export * from './service/config.service';
export * from './service/router.service';
export * from './service/resource.service';
export * from './service/localization.service';
export * from './utils';
export declare namespace ligui {
    const jsx: JSXService;
    const rest: RestService;
    const config: ConfigService;
    const router: RouterService;
    const resources: ResourceService;
    const localization: LocalizationService;
    const store: typeof Store;
    const utils: typeof Utils;
}
