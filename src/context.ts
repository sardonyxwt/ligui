import Container from 'bottlejs';
import { createStore, isStoreExist, Store } from '@sardonyxwt/state-store';
import {
    createEventBus,
    isEventBusExist,
    EventBus,
} from '@sardonyxwt/event-bus';

export interface Context {
    readonly store: Store;
    readonly bottle: Container;
    readonly eventBus: EventBus;
}

export function createContext(
    name: string,
    bottle: Container = new Container(name),
): Context {
    if (isStoreExist(name)) {
        throw new Error(`Ligui store exist with name ${name}`);
    }
    if (isEventBusExist(name)) {
        throw new Error(`Ligui event bus exist with name ${name}`);
    }

    return Object.freeze({
        store: createStore({ name }),
        eventBus: createEventBus({ name }),
        bottle: bottle,
    });
}
