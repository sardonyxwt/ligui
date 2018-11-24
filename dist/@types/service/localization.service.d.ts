import { LocalizationScope } from '../scope/localization.scope';
import { LocalizationLoader } from '../loader/localization.loader';
export interface LocalizationService extends LocalizationScope, LocalizationLoader {
}
export declare const localizationService: LocalizationService;
