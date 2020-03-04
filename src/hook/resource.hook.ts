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
) => <T = any>(
    key: string, context?: string
): T => {
    const resourceStore = container.get<ResourceStore>(LIGUI_TYPES.RESOURCE_STORE);
    const resourceService = container.get<ResourceService>(LIGUI_TYPES.RESOURCE_SERVICE);

    const resourceContext = context || React.useContext(ResourceKeyContext);

    const id: ResourceId = {key, context: resourceContext};

    const prepareResourceData = <T>() => {
        if (resourceStore.isResourceExist(id)) {
            return resourceStore.findResourceById<T>(id).data;
        }
        const resource = resourceService.loadResource(id);
        return resource instanceof Promise ? null : resource.data as T;
    };

    const [resource, setResource] = React.useState<T>(prepareResourceData);

    React.useEffect(() => {
        if (resource) {
            return;
        }
        Promise.resolve(resourceService.loadResource(id)).then(
            resource => setResource(() => resource.data as T)
        );
    }, [resource]);

    return resource;
};
