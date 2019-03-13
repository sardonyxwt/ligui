import { Translator } from '..';
export declare const defaultFallbackTranslator: (id: any) => any;
export declare type LocalizationHookType = (keys: string[], fallbackTranslator?: Translator) => Translator;
export declare function LocalizationHook(keys: string[], fallbackTranslator?: Translator): Translator;
