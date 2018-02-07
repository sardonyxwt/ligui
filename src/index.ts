import { Observable } from 'rxjs/Observable';
import * as SynchronizedUtils from '@sardonyxwt/utils/synchronized';
import * as GeneratorUtils from '@sardonyxwt/utils/generator';
import * as ObjectUtils from '@sardonyxwt/utils/object';
import * as FileUtils from '@sardonyxwt/utils/file';
import * as JsonUtils from '@sardonyxwt/utils/json';
import { JSXService } from './service/jsx.service';
import { RestService } from './service/rest.service';
import { StoreService } from './service/store.service';
import {
  LocalizationProvider, ILocalizationService
} from './provider/impl/localization.provider';
import {
  ResourceProvider, IResourceService
} from './provider/impl/resource.provider';
import {
  RouterProvider, IRouterService
} from './provider/impl/router.provider';
import {
  ConfigProvider, IConfigService
} from './provider/impl/config.provider';

export class Ligui {
  static readonly jsx = JSXService.INSTANCE;
  static readonly rest = RestService.INSTANCE;
  static readonly store = StoreService.INSTANCE;
  static readonly localization: ILocalizationService
    = LocalizationProvider.INSTANCE.getService();
  static readonly resource: IResourceService
    = ResourceProvider.INSTANCE.getService();
  static readonly router: IRouterService
    = RouterProvider.INSTANCE.getService();
  static readonly config: IConfigService
    = ConfigProvider.INSTANCE.getService();
  static readonly utils = ObjectUtils.deepFreeze({
    synchronized: SynchronizedUtils,
    generator: GeneratorUtils,
    object: ObjectUtils,
    file: FileUtils,
    json: JsonUtils,
    observable: Observable
  });
}

global['Ligui'] = Ligui;
