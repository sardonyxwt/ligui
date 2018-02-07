import { Provider } from '../provider';

export interface IConfigService {
  get<T = any>(name: string): Promise<T>;
}

export interface IConfigProviderConfig {
  loader: <T = any>(name: string) => Promise<T>;
}

class ConfigService implements IConfigService {

  constructor(private config: IConfigProviderConfig) {
  }

  get<T>(name: string): Promise<T> {
    return undefined;
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

  createService(config: IConfigProviderConfig): IConfigService {
    return new ConfigService(config);
  }

}
