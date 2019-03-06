import { LocalizationScopeAddons, LocalizationLoader } from '..';
export interface LocalizationService extends LocalizationScopeAddons, LocalizationLoader {
}
export declare function createLocalizationServiceInstance(): LocalizationService;
