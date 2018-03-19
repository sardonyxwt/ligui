import * as SynchronizedUtil from '@sardonyxwt/utils/synchronized';
import { createScope, Scope } from '@sardonyxwt/state-store';

export interface ConfigServiceState {
  configs: { [key: string]: any }
}

export interface ConfigServiceConfig {
  loader: (name: string) => Promise<any>;
  initState?: ConfigServiceState;
}

export interface ConfigService {
  set(name: string, config): Promise<ConfigServiceState>;
  get<T = any>(name: string): Promise<T>;
  getScope(): Scope<ConfigServiceState>;
  configure(config: ConfigServiceConfig);
}

export const CONFIG_SCOPE_NAME = 'CONFIG_SCOPE';
export const CONFIG_SCOPE_ACTION_LOAD = 'LOAD_CONFIG';

class ConfigServiceImpl implements ConfigService {

  private scope: Scope<ConfigServiceState>;
  private configCache: SynchronizedUtil.SynchronizedCache<any>;

  set(name: string, config) {
    return this.scope.dispatch(
      CONFIG_SCOPE_ACTION_LOAD, {name, config}
    );
  }

  get<T = any>(name: string): Promise<T> {
    let config = this.scope.getState()[name];
    if (config) {
      return Promise.resolve(config);
    }
    if (this.configCache.has(name)) {
      return this.configCache.get(name);
    }
    return this.configCache.get(name).then(config => {
      this.configCache.remove(name);
      return this.scope.dispatch(
        CONFIG_SCOPE_ACTION_LOAD,
        {name, config}
      ).then(scope => scope[name]);
    });
  }

  getScope() {
    return this.scope;
  }

  configure(config: ConfigServiceConfig) {
    if (this.scope) {
      throw new Error('ConfigService must configure only once.');
    }
    this.scope = createScope<ConfigServiceState>(
      CONFIG_SCOPE_NAME,
      config.initState || {configs: {}}
    );
    this.scope.registerAction(
      CONFIG_SCOPE_ACTION_LOAD,
      (scope, {name, config}, resolve) => resolve(
        Object.assign(scope, {[name]: config})
      )
    );
    this.scope.freeze();

    this.configCache = SynchronizedUtil.createSyncCache<any>(config.loader);
  }

}

export const configService: ConfigService = new ConfigServiceImpl();
