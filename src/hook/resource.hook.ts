import * as React from 'react';
import { Container } from 'inversify';
import { ResourceService } from '../service/resource.service';
import { LIGUI_TYPES } from '../types';
import { ResourceId, ResourceStore } from '../store/resource.store';

let ResourceKeyContext: React.Context<string> = null;

if (!!React) {
    ResourceKeyContext = React.createContext<string>(undefined);
}

export { ResourceKeyContext };

export const createResourceHook = (
    container: Container
) => <T = any>(key: string, context?: string): T => {
    const resourceStore = container.get<ResourceStore>(LIGUI_TYPES.RESOURCE_STORE);
    const resourceService = container.get<ResourceService>(LIGUI_TYPES.RESOURCE_SERVICE);

    const resourceKeyContext = React.useContext(ResourceKeyContext);

    const resourceContext = context || resourceKeyContext;

    const id: ResourceId = {key, context: resourceContext};

    const prepareResourceData = <T>() => {
        if (resourceStore.isResourceExist(id)) {
            return resourceStore.findResourceById<T>(id).data;
        }
        return null;
    };

    const [resource, setResource] = React.useState<T>(prepareResourceData);

    React.useEffect(() => {
        if (!resource) {
            resourceService.loadResource(id).then(() => setResource(prepareResourceData));
        }
    }, []);

    return resource;
};
