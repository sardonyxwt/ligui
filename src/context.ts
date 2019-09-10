import { createStore, getStore, isStoreExist, Store } from '@sardonyxwt/state-store';
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
    containerOptions = defaultContainerOptions
): Context {
    return Object.freeze({
        store: isStoreExist(name)
            ? getStore(name)
            : createStore({name}),
        container: new Container(containerOptions)
    });
}
