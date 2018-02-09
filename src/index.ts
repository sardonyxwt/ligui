import * as SynchronizedUtils from '@sardonyxwt/utils/synchronized';
import * as GeneratorUtils from '@sardonyxwt/utils/generator';
import * as ObjectUtils from '@sardonyxwt/utils/object';
import * as FileUtils from '@sardonyxwt/utils/file';
import * as JsonUtils from '@sardonyxwt/utils/json';
import * as Store from '@sardonyxwt/state-store';
import { JSXService } from './service/jsx.service';
import { RestService } from './service/rest.service';
import { ConfigService } from './service/config.service';
import { RouterService } from './service/router.service';
import { ResourceService } from './service/resource.service';
import { LocalizationService } from './service/localization.service';

export namespace ligui {
  export const jsx = JSXService.INSTANCE;
  export const rest = RestService.INSTANCE;
  export const config = ConfigService.INSTANCE;
  export const router = RouterService.INSTANCE;
  export const resources = ResourceService.INSTANCE;
  export const localization = LocalizationService.INSTANCE;
  export const ROOT_SCOPE = Store.ROOT_SCOPE;
  export const createScope = Store.createScope;
  export const getScope = Store.getScope;
  export const getState = Store.getState;
  export const utils = {
    synchronized: SynchronizedUtils,
    generator: GeneratorUtils,
    object: ObjectUtils,
    file: FileUtils,
    json: JsonUtils
  }
}

module.exports = ligui;
