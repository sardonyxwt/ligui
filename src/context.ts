import { Container, interfaces } from 'inversify';
import { createStore, isStoreExist, Store } from '@sardonyxwt/state-store';
import { createEventBus, isEventBusExist, EventBus } from '@sardonyxwt/event-bus';

export interface Context {
    readonly store: Store;
    readonly container: Container;
    readonly eventBus: EventBus;
}

const defaultContainerOptions: interfaces.ContainerOptions = {
    autoBindInjectable: true,
    skipBaseClassChecks: true
};

export function createContext(
    name: string,
    container: Container = new Container(defaultContainerOptions)
): Context {
    if (isStoreExist(name)) {
        throw new Error(`Ligui store exist with name ${name}`);
    }
    if (isEventBusExist(name)) {
        throw new Error(`Ligui event bus exist with name ${name}`);
    }

    return Object.freeze({
        store: createStore({name}),
        eventBus: createEventBus({name}),
        container
    });
}
