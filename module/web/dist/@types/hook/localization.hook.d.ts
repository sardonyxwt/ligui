import { Context } from '../context';
import { Translator } from '../scope/localization.scope';
export declare const defaultFallbackTranslator: (id: any) => any;
export declare function useLocalization(context: Context, keys: string[], fallbackTranslator?: Translator): Translator;
