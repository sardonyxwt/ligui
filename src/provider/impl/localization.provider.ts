import { Observable } from 'rxjs/Observable';

export type Translator = (key: string) => string;
export interface Localization { [key: string]: string }

export interface ILocalizationService {
  changeLocale(locale: string): void;
  getLocales(): string[];
  getDefaultLocale(): string;
  getCurrentLocale(): string;
  getTranslator(ids: string[]): Observable<Translator>;
}

export interface ILocalizationProviderConfig {
  loader: (id: string) => Promise<Localization>;
  locales: string[];
  defaultLocale: string;
  currentLocale: string;
}

class LocalizationService implements ILocalizationService {

  changeLocale(locale: string): void {
  }

  getLocales(): string[] {
    return undefined;
  }

  getDefaultLocale(): string {
    return undefined;
  }

  getCurrentLocale(): string {
    return undefined;
  }

  getTranslator(ids: string[]): Observable<Translator> {
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

  createService(config: ILocalizationProviderConfig): ILocalizationService {
    return new LocalizationService()
  }

}
