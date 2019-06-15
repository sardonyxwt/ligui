import { Container } from 'inversify';
import { Translator } from '../service/localization.service';
export declare const defaultFallbackTranslator: (id: any) => any;
export declare const createTranslatorHook: (container: Container) => (keys: string[], fallbackTranslator?: Translator) => Translator;
