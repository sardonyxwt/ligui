import 'reflect-metadata';
import { Store } from '@sardonyxwt/state-store';
import { Container, interfaces } from 'inversify';
export interface Context {
    readonly store: Store;
    readonly container: Container;
}
export declare function createContext(name: string, containerOptions?: interfaces.ContainerOptions): Context;
