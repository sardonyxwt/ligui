import { Container } from 'inversify';
import { Translator } from '../service/localization.service';
export declare const createTranslatorHook: (container: Container) => (keys: string[]) => Translator;
