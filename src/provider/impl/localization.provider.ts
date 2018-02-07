import { createScope, Scope } from '@sardonyxwt/state-store';
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

  subscribe(ids: string[], subscriber: (t: Translator) => void);
}

export interface ILocalizationProviderState {
  locales: string[];
  defaultLocale: string;
  currentLocale: string;
  localizations: { [key: string]: { [key: string]: string } }
}

export interface ILocalizationProviderConfig {
  loader: (id: string) => Promise<Localization>;
  locales: string[];
  defaultLocale: string;
  currentLocale: string;
  initState?: ILocalizationProviderState;
}

class LocalizationService implements ILocalizationService {

  private scope: Scope<ILocalizationProviderState>;

  constructor(private config: ILocalizationProviderConfig) {
    let findDefaultLocale = config.locales.find(
      locale => config.defaultLocale === locale
    );
    let findCurrentLocale = config.locales.find(
      locale => config.currentLocale === locale
    );
    if (!findDefaultLocale || !findCurrentLocale) {
      throw new Error('Invalid configuration LocalizationService.');
    }
    let localizations = {};
    config.locales.forEach(
      locale => localizations[locale]
    );
    this.scope = createScope<ILocalizationProviderState>(
      'LOCALIZATION_SCOPE',
      config.initState || {
        locales: config.locales,
        defaultLocale: config.defaultLocale,
        currentLocale: config.currentLocale,
        localizations
      }
    );
    this.scope.freeze();
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

  subscribe(ids: string[], subscriber: (t: Translator) => void) {
    return undefined;
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
