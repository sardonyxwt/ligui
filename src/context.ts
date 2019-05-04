import 'reflect-metadata';
import { Store, createStore } from '@sardonyxwt/state-store';
import { Container, interfaces } from 'inversify';

export interface Context {
  readonly store: Store;
  readonly container: Container;
}

export function createContext(
  name: string,
  containerOptions?: interfaces.ContainerOptions
): Context {
  return Object.freeze({
    store: createStore({name}),
    container: new Container(containerOptions)
  });
}
