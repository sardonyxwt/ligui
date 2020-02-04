import { createStore, isStoreExist, Store } from '@sardonyxwt/state-store';
import { Container, interfaces } from 'inversify';

export interface Context {
    readonly store: Store;
    readonly container: Container;
}

const defaultContainerOptions: interfaces.ContainerOptions = {
    autoBindInjectable: true,
    skipBaseClassChecks: true
};

export function createContext(
    name: string,
    containerOptions: interfaces.ContainerOptions = defaultContainerOptions
): Context {
    if (isStoreExist(name)) {
        throw new Error(`Ligui store exist with name ${name}`);
    }

    return Object.freeze({
        store: createStore({name}),
        container: new Container(containerOptions)
    });
}
