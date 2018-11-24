import { localizationScope, LocalizationScope } from '../scope/localization.scope';
import { localizationLoader, LocalizationLoader } from '../loader/localization.loader';

export interface LocalizationService extends LocalizationScope, LocalizationLoader {}

export const localizationService = Object.assign({}, localizationScope, localizationLoader) as LocalizationService;
