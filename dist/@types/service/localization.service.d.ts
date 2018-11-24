import { LocalizationScopeAddons } from '../scope/localization.scope';
import { LocalizationLoader } from '../loader/localization.loader';
export interface LocalizationService extends LocalizationScopeAddons, LocalizationLoader {
}
export declare const localizationService: LocalizationService;
