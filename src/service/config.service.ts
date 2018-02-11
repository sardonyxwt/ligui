import { createScope, Scope } from '@sardonyxwt/state-store';

export interface IConfigProviderState {
  configs: { [key: string]: any };
}

export interface IConfigProviderConfig {
  loader: (name: string) => Promise<any>;
  initState?: IConfigProviderState;
}

export class ConfigService {

  public static readonly SCOPE_NAME = 'CONFIG_SCOPE';
  public static readonly LOAD_CONFIG_ACTION = 'LOAD_CONFIG';
  private scope: Scope<IConfigProviderState>;
  private isConfigured: boolean;
  private static instance: ConfigService;

  private constructor() {
  }

  static get INSTANCE() {
    return this.instance || (this.instance = new ConfigService());
  }

  get<T>(name: string): Promise<T> {
    return this.scope.dispatch(ConfigService.LOAD_CONFIG_ACTION, name)
      .then(scope => <T>scope[name]);
  }

  getScope() {
    return this.scope;
  }

  configure(config: IConfigProviderConfig) {
    if (this.isConfigured) {
      throw new Error('ConfigService must configure only once.');
    } else this.isConfigured = true;
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

}
