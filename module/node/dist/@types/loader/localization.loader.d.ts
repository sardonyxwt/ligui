import { Localization, LocalizationScope, Translator } from '../scope/localization.scope';
export declare type LocalizationPartLoader = (locale: string, id: string) => Localization | Promise<Localization>;
export declare type LocalizationLoader = (keys: string[]) => Promise<Translator>;
export declare function createLocalizationLoader(localizationScope: LocalizationScope, loader: LocalizationPartLoader): LocalizationLoader;
