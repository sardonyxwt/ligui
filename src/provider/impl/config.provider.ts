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

  private scope: Scope<IConfigProviderState>;

  constructor(private config: IConfigProviderConfig) {
    this.scope = createScope<IConfigProviderState>(
      'CONFIG_SCOPE',
      config.initState || {
        configs: {}
      }
    );
    this.scope.registerAction('LOAD_CONFIG', (scope, props, resolve) => {
      if (scope[props]) {
        resolve(scope);
      } else {
        config.loader(props).then(config => {
          resolve(Object.assign(
            scope, {[name]: config})
          );
        });
      }
    });
    this.scope.freeze();
  }

  get<T>(name: string): Promise<T> {
    return this.scope.dispatch('LOAD_CONFIG', name)
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
