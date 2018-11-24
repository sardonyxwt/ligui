import { Localization, Translator } from '..';
export declare type LLoader = (locale: string, id: string) => Localization | Promise<Localization>;
export interface LocalizationLoader {
    loader: LLoader;
    loadLocalizations(keys: string[]): Promise<Translator>;
}
export declare const localizationLoader: LocalizationLoader;
