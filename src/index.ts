import { jsxService, JSXService } from './service/jsx.service';
import { restService, RestService } from './service/rest.service';
import { storeService, StoreService } from './service/store.service';
import { configService, ConfigService } from './service/config.service';
import { resourceService, ResourceService } from './service/resource.service';
import { navigationService, NavigationService } from './service/navigation.service';
import { localizationService, LocalizationService } from './service/localization.service';

export interface Ligui {
  jsx: JSXService;
  rest: RestService;
  store: StoreService;
  config: ConfigService;
  resource: ResourceService;
  navigation: NavigationService;
  localization: LocalizationService;
}

class LiguiImpl implements Ligui {
  jsx = jsxService;
  rest = restService;
  store = storeService;
  config = configService;
  resource = resourceService;
  navigation = navigationService;
  localization = localizationService;
}

export const ligui: Ligui = global['ligui'] = new LiguiImpl();
