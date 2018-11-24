import { resourceScope, ResourceScope } from '../scope/resource.scope';
import { resourceLoader, ResourceLoader } from '../loader/resource.loader';

export interface ResourceService extends ResourceScope, ResourceLoader {}

export const resourceService = Object.assign({}, resourceScope, resourceLoader) as ResourceService;
