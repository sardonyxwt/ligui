import { Context } from '@src/context';
import { Translator } from '@src/scope/localization.scope';
export declare const defaultFallbackTranslator: (id: any) => any;
export declare type LocalizationHookType = (context: Context, keys: string[], fallbackTranslator?: Translator) => Translator;
export declare function useLocalization(context: Context, keys: string[], fallbackTranslator?: Translator): Translator;
