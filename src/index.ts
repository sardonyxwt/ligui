import * as Store from '@sardonyxwt/state-store';
import * as Utils from './utils';
import { jsxService, JSXService } from './service/jsx.service';
import { restService, RestService } from './service/rest.service';
import { configService, ConfigService } from './service/config.service';
import { routerService, RouterService } from './service/router.service';
import { resourceService, ResourceService } from './service/resource.service';
import { localizationService, LocalizationService } from './service/localization.service';

export * from '@sardonyxwt/state-store';
export * from './service/jsx.service';
export * from './service/rest.service';
export * from './service/config.service';
export * from './service/router.service';
export * from './service/resource.service';
export * from './service/localization.service';
export * from './utils';

export namespace ligui {
  export const jsx: JSXService = jsxService;
  export const rest: RestService = restService;
  export const config: ConfigService = configService;
  export const router: RouterService = routerService;
  export const resources: ResourceService = resourceService;
  export const localization: LocalizationService = localizationService;
  export const store = Store;
  export const utils = Utils;
}

global['ligui'] = ligui;
