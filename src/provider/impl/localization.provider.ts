import { createScope, Scope } from '@sardonyxwt/state-store';
import { createSyncCache, SynchronizedCache } from '@sardonyxwt/utils/synchronized';
import { Provider } from '../provider';

export type Translator = (key: string) => string;

export interface Localization {
  [key: string]: string
}

export interface ILocalizationService {
  changeLocale(locale: string): void;

  getLocales(): string[];

  getDefaultLocale(): string;

  getCurrentLocale(): string;

  subscribe(id: string, subscriber: (t: Translator) => void);
}

export interface ILocalizationProviderState {
  locales: string[];
  defaultLocale: string;
  currentLocale: string;
  localizations: { [key: string]: Localization }
}

export interface ILocalizationProviderConfig {
  loader: (id: string) => Promise<Localization>;
  locales: string[];
  defaultLocale: string;
  currentLocale: string;
  initState?: ILocalizationProviderState;
}

class LocalizationService implements ILocalizationService {

  static readonly SCOPE_NAME = 'LOCALIZATION_SCOPE';
  static readonly ADD_LOCALIZATION_ACTION = 'ADD_LOCALIZATION';
  static readonly CHANGE_LOCALIZATION_ACTION = 'CHANGE_LOCALIZATION';

  private scope: Scope<ILocalizationProviderState>;
  private localizationCache: SynchronizedCache<Localization>;

  constructor(private config: ILocalizationProviderConfig) {
    let findDefaultLocale = config.locales.find(
      locale => config.defaultLocale === locale
    );
    if (!findDefaultLocale) {
      throw new Error('Invalid configuration LocalizationService.');
    }
    let findCurrentLocale = config.locales.find(
      locale => config.currentLocale === locale
    );
    let localizations = {};
    config.locales.forEach(
      locale => localizations[locale]
    );
    this.scope = createScope<ILocalizationProviderState>(
      LocalizationService.SCOPE_NAME,
      config.initState || {
        locales: config.locales,
        defaultLocale: findDefaultLocale,
        currentLocale: findCurrentLocale || findDefaultLocale,
        localizations
      }
    );
    this.scope.registerAction(
      LocalizationService.ADD_LOCALIZATION_ACTION,
      (scope, props, resolve) => {

      }
    );
    this.scope.registerAction(
      LocalizationService.CHANGE_LOCALIZATION_ACTION,
      (scope, props, resolve) => {

      }
    );
    this.scope.freeze();
    this.localizationCache = createSyncCache<Localization>(config.loader);
  }

  changeLocale(locale: string): void {
  }

  getLocales(): string[] {
    return this.scope.getState().locales.slice();
  }

  getDefaultLocale(): string {
    return this.scope.getState().defaultLocale;
  }

  getCurrentLocale(): string {
    return this.scope.getState().currentLocale;
  }

  subscribe(id: string, subscriber: (t: Translator) => void) {
    let state = this.scope.getState();
    let localizationId = this.getLocalizationId(id);
    let localization = state.localizations[localizationId];
    if (localization) {
      subscriber((key: string) => localization[key]);
    }
    if (this.localizationCache.has(localizationId)) {
      this.localizationCache.get(localizationId).then(
        localization => subscriber((key: string) => localization[key])
      );
    } else {

    }
    return undefined; // todo
  }

  private getLocalizationId(id: string) {
    return `${this.scope.getState().currentLocale}:${id}`
  }

}

export class LocalizationProvider
  extends Provider<ILocalizationService, ILocalizationProviderConfig> {

  private static instance: LocalizationProvider;

  private constructor() {
    super();
  }

  static get INSTANCE() {
    return this.instance || (this.instance = new LocalizationProvider());
  }

  protected createService(config: ILocalizationProviderConfig): ILocalizationService {
    return new LocalizationService(config);
  }

}
