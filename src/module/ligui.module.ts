import { Observable } from 'rxjs/Observable';
import * as SynchronizedUtils from '@sardonyxwt/utils/synchronized';
import * as GeneratorUtils from '@sardonyxwt/utils/generator';
import * as ObjectUtils from '@sardonyxwt/utils/object';
import * as FileUtils from '@sardonyxwt/utils/file';
import * as JsonUtils from '@sardonyxwt/utils/json';
import { JSXService } from '../service/jsx.service';
import { RestService } from '../service/rest.service';
import { StoreService } from '../service/store.service';
import {
  LocalizationProvider, ILocalizationService
} from '../provider/impl/localization.provider';
import {
  ResourceProvider, IResourceService
} from '../provider/impl/resource.provider';
import {
  RouterProvider, IRouterService
} from '../provider/impl/router.provider';

export class Ligui {

  static get jsx() {
    return JSXService.INSTANCE
  };

  static get rest() {
    return RestService.INSTANCE
  };

  static get store() {
    return StoreService.INSTANCE
  };

  static get utils() {
    return ObjectUtils.deepFreeze({
      synchronized: SynchronizedUtils,
      generator: GeneratorUtils,
      object: ObjectUtils,
      file: FileUtils,
      json: JsonUtils,
      observable: Observable
    })
  };

  static get localization(): ILocalizationService {
    return LocalizationProvider.INSTANCE.getService();
  };

  static get resource(): IResourceService {
    return ResourceProvider.INSTANCE.getService();
  };

  static get router(): IRouterService {
    return RouterProvider.INSTANCE.getService();
  };

}

export default (global['Ligui'] = Ligui);
