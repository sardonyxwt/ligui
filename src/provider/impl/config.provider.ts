import { createScope, Scope } from '@sardonyxwt/state-store';
import { Provider } from '../provider';

export interface IConfigService {
  get<T = any>(name: string): Promise<T>;
}

export interface IConfigProviderState {
  configs: { [key: string]: any };
}

export interface IConfigProviderConfig {
  loader: <T = any>(name: string) => Promise<T>;
  initState?: IConfigProviderState;
}

class ConfigService implements IConfigService {

  static readonly SCOPE_NAME = 'CONFIG_SCOPE';
  static readonly LOAD_CONFIG_ACTION = 'LOAD_CONFIG';

  private scope: Scope<IConfigProviderState>;

  constructor(private config: IConfigProviderConfig) {
    this.scope = createScope<IConfigProviderState>(
      ConfigService.SCOPE_NAME,
      config.initState || {
        configs: {}
      }
    );
    this.scope.registerAction(
      ConfigService.LOAD_CONFIG_ACTION,
      (scope, props, resolve) => {
        if (scope[props]) {
          resolve(scope);
        } else {
          config.loader(props).then(config => {
            resolve(Object.assign(
              scope, {[name]: config})
            );
          });
        }
      }
    );
    this.scope.freeze();
  }

  get<T>(name: string): Promise<T> {
    return this.scope.dispatch(ConfigService.LOAD_CONFIG_ACTION, name)
      .then(scope => <T>scope[name]);
  }

}

export class ConfigProvider extends Provider<IConfigService, IConfigProviderConfig> {

  private static instance: ConfigProvider;

  private constructor() {
    super();
  }

  static get INSTANCE() {
    return this.instance || (this.instance = new ConfigProvider());
  }

  protected createService(config: IConfigProviderConfig): IConfigService {
    return new ConfigService(config);
  }

}
