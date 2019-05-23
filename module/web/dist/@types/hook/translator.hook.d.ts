import { Translator, LocalizationService } from '../service/localization.service';
export declare const defaultFallbackTranslator: (id: any) => any;
export declare const createTranslatorHook: (localizationService: LocalizationService) => (keys: string[], fallbackTranslator?: Translator) => Translator;
