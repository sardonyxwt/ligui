import * as preact from 'preact';
import * as store from '@sardonyxwt/state-store';
import * as SynchronizedUtils from '@sardonyxwt/utils/synchronized';
import * as GeneratorUtils from '@sardonyxwt/utils/generator';
import * as ObjectUtils from '@sardonyxwt/utils/object';
import * as FileUtils from '@sardonyxwt/utils/file';
import * as JsonUtils from '@sardonyxwt/utils/json';
import { JSXService } from './service/jsx.service';
import { RestService } from './service/rest.service';
import {
  LocalizationProvider, ILocalizationService, ILocalizationProviderConfig
} from './provider/impl/localization.provider';
import {
  ResourceProvider, IResourceService, IResourceProviderConfig
} from './provider/impl/resource.provider';
import {
  RouterProvider, IRouterService, IRouterProviderConfig
} from './provider/impl/router.provider';
import {
  ConfigProvider, IConfigService, IConfigProviderConfig
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
  configure(config: {
    localization: ILocalizationProviderConfig | null,
    resource: IResourceProviderConfig | null,
    router: IRouterProviderConfig | null,
    config: IConfigProviderConfig | null
  }) {
    if (config.localization) LocalizationProvider.INSTANCE.configure(config.localization);
    if (config.resource) ResourceProvider.INSTANCE.configure(config.resource);
    if (config.router) RouterProvider.INSTANCE.configure(config.router);
    if (config.config) ConfigProvider.INSTANCE.configure(config.config);
  },
  jsx: JSXService.INSTANCE,
  rest: RestService.INSTANCE,
  preact,
  store,
  utils: Object.freeze({
    synchronized: SynchronizedUtils,
    generator: GeneratorUtils,
    object: ObjectUtils,
    file: FileUtils,
    json: JsonUtils
  })
});

module.exports = ligui;
