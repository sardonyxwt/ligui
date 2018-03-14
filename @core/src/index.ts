import * as Store from '@sardonyxwt/state-store';
import { JSXService } from './service/jsx.service';
import { RestService } from './service/rest.service';
import { ConfigService } from './service/config.service';
import { ResourceService } from './service/resource.service';
import { LocalizationService } from './service/localization.service';

export * from '@sardonyxwt/state-store';
export * from './service/jsx.service';
export * from './service/rest.service';
export * from './service/config.service';
export * from './service/router.service';
export * from './service/resource.service';
export * from './service/localization.service';

export interface Ligui {
  jsx: JSXService;
  rest: RestService;
  config: ConfigService;
  resource: ResourceService;
  localization: LocalizationService;
  store: Store;
}
