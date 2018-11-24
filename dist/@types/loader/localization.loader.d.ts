import { Localization, Translator } from '../scope/localization.scope';
export declare type LLoader = (locale: string, id: string) => Localization | Promise<Localization>;
export interface LocalizationLoader {
    loader: LLoader;
    loadLocalizations(keys: string[]): Promise<Translator>;
}
export declare const localizationLoader: LocalizationLoader;
