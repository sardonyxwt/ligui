import * as Store from '@sardonyxwt/state-store';
import { JSXService } from './service/jsx.service';
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

export namespace ligui {
  export let jsx: JSXService = null;
  export let rest: RestService = restService;
  export let config: ConfigService = configService;
  export let router: RouterService = routerService;
  export let resources: ResourceService = resourceService;
  export let localization: LocalizationService = localizationService;
  export let utils: { [id: string]: any } = {};
  export let extensions: { [id: string]: any } = {};
  export let store = Store;
}

global['ligui'] = ligui;
