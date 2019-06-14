import { Translator, LocalizationService } from './localization.service';
export declare const defaultFallbackTranslator: (id: any) => any;
export declare const createLocalizationHook: (localizationService: LocalizationService) => (keys: string[], fallbackTranslator?: Translator) => Translator;
