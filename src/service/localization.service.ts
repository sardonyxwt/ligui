import { createScope, Scope } from '@sardonyxwt/state-store';
import { createSyncCache, SynchronizedCache } from '@sardonyxwt/utils/synchronized';

export type Translator = (key: string) => string;
export interface AddLocalizationActionProps { localizationId: string, localization: Localization }

export interface Localization {
  [key: string]: string
}

export interface ILocalizationProviderState {
  locales: string[];
  defaultLocale: string;
  currentLocale: string;
  localizations: { [key: string]: Localization }
}

export interface ILocalizationProviderConfig {
  loader: (locale: string, id: string) => Promise<Localization>;
  initState: ILocalizationProviderState;
}

export class LocalizationService {

  public static readonly SCOPE_NAME = 'LOCALIZATION_SCOPE';
  public static readonly ADD_LOCALIZATION_ACTION = 'ADD_LOCALIZATION';
  public static readonly CHANGE_LOCALIZATION_ACTION = 'CHANGE_LOCALIZATION';

  private scope: Scope<ILocalizationProviderState>;
  private isConfigured: boolean;
  private localizationCache: SynchronizedCache<Localization>;
  private static instance: LocalizationService;

  private constructor() {
  }

  static get INSTANCE() {
    return this.instance || (this.instance = new LocalizationService());
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
    let localizationId = `${this.scope.getState().currentLocale}:${id}`;
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

  configure(config: ILocalizationProviderConfig) {
    if (this.isConfigured) {
      throw new Error('ResourceService must configure only once.');
    } else this.isConfigured = true;
    this.scope = createScope<ILocalizationProviderState>(
      LocalizationService.SCOPE_NAME,
      config.initState
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
        const isSupportLocale = scope.locales.find(
          locale => locale === props
        );
        if (!isSupportLocale) {
          throw new Error('Locale not supported.');
        }
        resolve({
          ...scope,
          currentLocale: props
        });
      }
    );
    this.scope.freeze();
    this.localizationCache = createSyncCache<Localization>((key: string) => {
      const [locale, id] = key.split(':');
      return config.loader(locale, id);
    });
  }

}
