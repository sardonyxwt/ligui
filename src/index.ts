import { createScope, getState, getScope, Scope } from '@sardonyxwt/state-store';
import * as SynchronizedUtils from '@sardonyxwt/utils/synchronized';
import * as GeneratorUtils from '@sardonyxwt/utils/generator';
import * as ObjectUtils from '@sardonyxwt/utils/object';
import * as FileUtils from '@sardonyxwt/utils/file';
import * as JsonUtils from '@sardonyxwt/utils/json';
import { JSXService } from './service/jsx.service';
import { RestService } from './service/rest.service';
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

export const ligui = Object.freeze({
  get localization(): ILocalizationService {
    return LocalizationProvider.INSTANCE.getService();
  },
  get resource(): IResourceService {
    return ResourceProvider.INSTANCE.getService();
  },
  get router(): IRouterService {
    return RouterProvider.INSTANCE.getService();
  },
  get config(): IConfigService {
    return ConfigProvider.INSTANCE.getService();
  },
  localizationProvider: LocalizationProvider.INSTANCE,
  resourceProvider: ResourceProvider.INSTANCE,
  routerProvider: RouterProvider.INSTANCE,
  configProvider: ConfigProvider.INSTANCE,
  jsx: JSXService.INSTANCE,
  rest: RestService.INSTANCE,
  createScope,
  getScope,
  getState,
  utils: {
    synchronized: SynchronizedUtils,
    generator: GeneratorUtils,
    object: ObjectUtils,
    file: FileUtils,
    json: JsonUtils
  }
});

module.exports = ligui;
