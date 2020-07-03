import * as React from 'react';
import * as Container from 'bottlejs';
import { ResourceService } from '../service/resource.service';
import { LIGUI_TYPES } from '../types';
import { ResourceId, ResourceStore } from '../store/resource.store';

let ResourceKeyContext: React.Context<string> = null;

if (!!React) {
    ResourceKeyContext = React.createContext<string>(undefined);
}

export { ResourceKeyContext };

export const createResourceHook = (container: Container.IContainer) => <
    T = unknown
>(
    key: string,
    context?: string,
): T => {
    const resourceStore = container[
        LIGUI_TYPES.RESOURCE_STORE
    ] as ResourceStore;
    const resourceService = container[
        LIGUI_TYPES.RESOURCE_SERVICE
    ] as ResourceService;

    const resourceContext = context || React.useContext(ResourceKeyContext);

    const id: ResourceId = { key, context: resourceContext };

    const prepareResourceData = <T>() => {
        if (resourceStore.isResourceExist(id)) {
            return resourceStore.findResourceById<T>(id).data;
        }
        const resource = resourceService.loadResource<T>(id);
        return resource instanceof Promise ? null : resource.data;
    };

    const [resource, setResource] = React.useState<T>(prepareResourceData);

    React.useEffect(() => {
        if (resource) {
            return;
        }
        Promise.resolve(resourceService.loadResource<T>(id)).then((resource) =>
            setResource(() => resource.data),
        );
    }, [resource]);

    return resource;
};
