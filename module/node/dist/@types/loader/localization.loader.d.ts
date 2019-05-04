import { Localization, LocalizationScope, Translator } from '@src/scope/localization.scope';
export declare type PartLocalizationLoader = (locale: string, id: string) => Localization | Promise<Localization>;
export declare type LocalizationLoader = (keys: string[]) => Promise<Translator>;
export declare function createLocalizationLoader(localizationScope: LocalizationScope, loader: PartLocalizationLoader): LocalizationLoader;
