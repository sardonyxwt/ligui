import * as SynchronizedUtil from '@sardonyxwt/utils/synchronized';
import { createScope, Scope } from '../index';

export type Translator = (key: string) => string;

export interface Localization {
  [key: string]: string
}

export interface LocalizationProviderState {
  locales: string[];
  defaultLocale: string;
  currentLocale: string;
  localizations: { [key: string]: Localization }
}

export interface LocalizationProviderConfig {
  loader: (locale: string, id: string) => Promise<Localization>;
  initState: LocalizationProviderState;
}

export interface LocalizationService {
  changeLocale(locale: string): Promise<LocalizationProviderState>;
  getScope(): Scope<LocalizationProviderState>;
  getLocales(): string[];
  getDefaultLocale(): string;
  getCurrentLocale(): string;
  subscribe(id: string, subscriber: (t: Translator) => void): void;
  configure(config: LocalizationProviderConfig): void;
}

export const LOCALIZATION_SCOPE_NAME = 'LOCALIZATION_SCOPE';
export const LOCALIZATION_SCOPE_ACTION_ADD = 'ADD_LOCALIZATION';
export const LOCALIZATION_SCOPE_ACTION_CHANGE = 'CHANGE_LOCALIZATION';

class LocalizationServiceImpl implements LocalizationService {

  private scope: Scope<LocalizationProviderState>;
  private defaultTranslator: Translator;
  private localizationCache: SynchronizedUtil.SynchronizedCache<Localization>;

  changeLocale(locale: string): Promise<LocalizationProviderState> {
    return this.scope.dispatch(LOCALIZATION_SCOPE_ACTION_CHANGE, locale);
  }

  getScope() {
    return this.scope;
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
    const {scope, localizationCache} = this;

    const listenerId = scope.subscribe(() => {
      scope.unsubscribe(listenerId);
      this.subscribe(id, subscriber);
    }, LOCALIZATION_SCOPE_ACTION_CHANGE);

    let state = scope.getState();
    let localizationId = `${scope.getState().currentLocale}:${id}`;
    let localization = state.localizations[localizationId];
    if (localization) {
      subscriber((key: string) => localization[key]);
      return;
    }
    subscriber(this.defaultTranslator);

    const isFirstCall = !localizationCache.has(localizationId);
    this.localizationCache.get(localizationId).then(localization => {
      if (isFirstCall) {
        scope.dispatch(
          LOCALIZATION_SCOPE_ACTION_ADD,
          {id, localization}
        ).then(
          () => localizationCache.remove(localizationId)
        );
      }
      subscriber((key: string) => localization[key]);
    });
  }

  configure(config: LocalizationProviderConfig) {
    if (this.scope) {
      throw new Error('ResourceService must configure only once.');
    }
    this.scope = createScope<LocalizationProviderState>(
      LOCALIZATION_SCOPE_NAME,
      config.initState
    );
    this.scope.registerAction(
      LOCALIZATION_SCOPE_ACTION_ADD,
      (scope, props, resolve) => {
        const localizations = Object.assign(
          scope.localizations,
          {[props.id]: props.localization}
        );
        resolve(Object.assign(scope, {localizations}));
      }
    );
    this.scope.registerAction(
      LOCALIZATION_SCOPE_ACTION_CHANGE,
      (scope, currentLocale, resolve) => {
        const isSupportLocale = scope.locales.find(
          locale => locale === currentLocale
        );
        if (!isSupportLocale) {
          throw new Error('Locale not supported.');
        }
        resolve(Object.assign(scope, {currentLocale}));
      }
    );
    this.scope.freeze();
    this.localizationCache = SynchronizedUtil.createSyncCache<Localization>((key: string) => {
      const [locale, id] = key.split(':');
      return config.loader(locale, id);
    });
    this.defaultTranslator = () => '...';
  }

}

export const localizationService: LocalizationService = new LocalizationServiceImpl();
