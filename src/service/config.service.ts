import { createScope, Scope } from '@sardonyxwt/state-store';
import { createSyncCache, SynchronizedCache } from '@sardonyxwt/utils/synchronized';

export interface ConfigProviderState { configs: { [key: string]: any } }
export interface ConfigProviderConfig {
  loader: (name: string) => Promise<any>;
  initState?: ConfigProviderState;
}

export class ConfigService {

  public static readonly SCOPE_NAME = 'CONFIG_SCOPE';
  public static readonly ADD_CONFIG_ACTION = 'LOAD_CONFIG';
  private scope: Scope<ConfigProviderState>;
  private configCache: SynchronizedCache<any>;
  private static instance: ConfigService;

  private constructor() {
  }

  static get INSTANCE() {
    return this.instance || (this.instance = new ConfigService());
  }

  set(name: string, config) {
    return this.scope.dispatch(
      ConfigService.ADD_CONFIG_ACTION, {name, config}
    );
  }

  get(name: string): Promise<any> {
    let config = this.scope.getState()[name];
    if (config) {
      return Promise.resolve(config);
    }
    if (this.configCache.has(name)) {
      return this.configCache.get(name);
    }
    return this.configCache.get(name).then(config => {
      this.configCache.remove(name);
      this.scope.dispatch(ConfigService.ADD_CONFIG_ACTION, {name, config});
      return config;
    });
  }

  getScope() {
    return this.scope;
  }

  configure(config: ConfigProviderConfig) {
    if (this.scope) {
      throw new Error('ConfigService must configure only once.');
    }
    this.scope = createScope<ConfigProviderState>(
      ConfigService.SCOPE_NAME,
      config.initState || {configs: {}}
    );
    this.scope.registerAction(
      ConfigService.ADD_CONFIG_ACTION,
      (scope, props, resolve) => resolve(
        Object.assign(scope, {[props.name]: props.config})
      )
    );
    this.scope.freeze();

    this.configCache = createSyncCache<any>(config.loader);
  }

}
