import * as Store from '@sardonyxwt/state-store';
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
export declare namespace ligui {
    let jsx: JSXService;
    let rest: RestService;
    let config: ConfigService;
    let router: RouterService;
    let resources: ResourceService;
    let localization: LocalizationService;
    let utils: {
        [id: string]: any;
    };
    let extensions: {
        [id: string]: any;
    };
    let store: typeof Store;
}
