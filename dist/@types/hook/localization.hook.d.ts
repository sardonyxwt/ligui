import { LocalizationService, Translator } from '..';
export declare const defaultFallbackTranslator: (id: any) => any;
export declare type LocalizationHookType = (keys: string[], fallbackTranslator?: Translator) => Translator;
export declare const createLocalizationHookInstance: (localizationService: LocalizationService) => LocalizationHookType;
