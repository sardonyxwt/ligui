import { createScope, Scope } from '@sardonyxwt/state-store';
import { createSyncCache, SynchronizedCache } from '@sardonyxwt/utils/synchronized';
import { Provider } from '../provider';

export type Translator = (key: string) => string;
export interface AddLocalizationActionProps { localizationId: string, localization: Localization }

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
  defaultLocale?: string;
  currentLocale?: string;
  initState?: ILocalizationProviderState;
}

class LocalizationService implements ILocalizationService {

  static readonly SCOPE_NAME = 'LOCALIZATION_SCOPE';
  static readonly ADD_LOCALIZATION_ACTION = 'ADD_LOCALIZATION';
  static readonly CHANGE_LOCALIZATION_ACTION = 'CHANGE_LOCALIZATION';

  readonly scope: Scope<ILocalizationProviderState>;
  private localizationCache: SynchronizedCache<Localization>;

  constructor(private config: ILocalizationProviderConfig) {
    if (config.locales.length <= 0) {
      throw new Error('Invalid configuration LocalizationService.');
    }

    let defaultLocale: string;
    if (config.defaultLocale) {
      defaultLocale = config.locales.find(
        locale => config.defaultLocale === locale
      );
      if (!defaultLocale) {
        throw new Error('Invalid configuration LocalizationService.');
      }
    } else {
      defaultLocale = config.locales[0];
    }

    let currentLocale: string;
    if (config.currentLocale) {
      currentLocale = config.locales.find(
        locale => config.currentLocale === locale
      );
      if (!defaultLocale) {
        throw new Error('Invalid configuration LocalizationService.');
      }
    } else {
      currentLocale = defaultLocale;
    }

    let localizations = {};
    config.locales.forEach(
      locale => localizations[locale]
    );

    this.scope = createScope<ILocalizationProviderState>(
      LocalizationService.SCOPE_NAME,
      config.initState || {
        locales: config.locales,
        defaultLocale,
        currentLocale,
        localizations
      }
    );
    this.scope.registerAction(
      LocalizationService.ADD_LOCALIZATION_ACTION,
      (scope, props: AddLocalizationActionProps, resolve) => {
        const localizations = {
          ...scope.localizations,
          [props.localizationId]: props.localization
        };
        resolve({
          ...scope,
          localizations
        });
      }
    );
    this.scope.registerAction(
      LocalizationService.CHANGE_LOCALIZATION_ACTION,
      (scope, props, resolve) => {
        const supportLocale = scope.locales.find(locale => locale === props);
        if (!supportLocale) {
          throw new Error('Locale not supported.');
        }
        resolve({
          ...scope,
          currentLocale: props
        });
      }
    );
    this.scope.freeze();
    this.localizationCache = createSyncCache<Localization>(config.loader);
  }

  changeLocale(locale: string): Promise<ILocalizationProviderState> {
    return this.scope.dispatch(LocalizationService.CHANGE_LOCALIZATION_ACTION, locale);
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
    const isFirstCall = this.localizationCache.has(localizationId);
    this.localizationCache.get(localizationId)
      .then(localization => subscriber((key: string) => localization[key]))
      .then(localization => {
        if (isFirstCall) {
          this.scope.dispatch(
            LocalizationService.ADD_LOCALIZATION_ACTION,
            {localizationId, localization}
          ).then(
            () => this.localizationCache.remove(localizationId)
          );
        }
      });
    const listenerId = this.scope.subscribe(() => {
      this.scope.unsubscribe(listenerId);
      this.subscribe(id, subscriber);
    }, LocalizationService.CHANGE_LOCALIZATION_ACTION);
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
