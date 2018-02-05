import * as GeneratorUtils from '@sardonyxwt/utils/generator';
import * as ObjectUtils from '@sardonyxwt/utils/object';
import * as FileUtils from '@sardonyxwt/utils/file';
import * as JsonUtils from '@sardonyxwt/utils/json';
import * as SynchronizedUtils from '@sardonyxwt/utils/synchronized';
import { ConfigProvider } from '@sardonyxwt/config-provider';
import { JSXManager } from './manager/jsx.manager';
import { RestManager } from './manager/rest.manager';
import { StoreManager } from './manager/store.manager';

export abstract class Ligui {
  static readonly jsx = JSXManager.INSTANCE;
  static readonly rest = RestManager.INSTANCE;
  static readonly store = StoreManager.INSTANCE;
  static readonly providers = {
    config: ConfigProvider.INSTANCE
  };
  static readonly utils = {
    generator: GeneratorUtils,
    object: ObjectUtils,
    file: FileUtils,
    json: JsonUtils,
    sync: SynchronizedUtils,
  };
}

global['Ligui'] = Ligui;
