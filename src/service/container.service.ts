import { Container, decorate } from 'inversify';
import { jsxService, JSXService } from './jsx.service';
import { restService, RestService } from './rest.service';
import { storeService, StoreService } from './store.service';
import { resourceService, ResourceService } from './resource.service';
import { localizationService, LocalizationService } from './localization.service';

export interface Newable<T> {
  new (...args: any[]): T;
}

export interface Abstract<T> {
  prototype: T;
}

export type ContainerKey = string | number | symbol;
export type ContainerId<T = any> = string | symbol | Newable<T> | Abstract<T>;

export enum LiguiTypes {
  JSX_SERVICE = 'LIG_JSX_SERVICE',
  REST_SERVICE = 'LIG_REST_SERVICE',
  STORE_SERVICE = 'LIG_STORE_SERVICE',
  RESOURCE_SERVICE = 'LIG_RESOURCE_SERVICE',
  LOCALIZATION_SERVICE = 'LIG_LOCALIZATION_SERVICE',
  CONTAINER_SERVICE = 'LIG_CONTAINER_SERVICE',

  TOAST_API = 'LIG_TOAST_API',
  DIALOG_API = 'LIG_DIALOG_API',
  PRELOADER_API = 'LIG_PRELOADER_API',
  CONTEXTMENU_API = 'LIG_CONTEXTMENU_API',
  NOTIFICATION_API = 'LIG_NOTIFICATION_API',
}

let container = new Container({
  skipBaseClassChecks: true,
});

export interface ContainerService {
  readonly container: Container;
  resolve<T = any>(id: ContainerId): T;
  resolveNamed<T = any>(id: ContainerId, name: ContainerKey): T;
  resolveTagged<T = any>(id: ContainerId, key: ContainerKey, value: any): T;
  resolveAll<T = any>(id: ContainerId): T[];
  resolveAllNamed<T = any>(id: ContainerId, name: ContainerKey): T[];
  resolveAllTagged<T = any>(id: ContainerId, key: ContainerKey, value: any): T[];
  decorate(decorator: (ClassDecorator | ParameterDecorator | MethodDecorator), target: any, parameterIndex?: number | string): void;
}

export const containerService = Object.freeze({
  resolve<T = any>(id: ContainerId): T {
    return container.get<T>(id);
  },
  resolveNamed<T = any>(id: ContainerId, name: ContainerKey): T {
    return container.getNamed(id, name);
  },
  resolveTagged<T = any>(id: ContainerId, key: ContainerKey, value: any): T {
    return container.getTagged(id, key, value);
  },
  resolveAll<T = any>(id: ContainerId): T[] {
    return container.getAll(id);
  },
  resolveAllNamed<T = any>(id: ContainerId, name: ContainerKey): T[] {
    return container.getAllNamed(id, name);
  },
  resolveAllTagged<T = any>(id: ContainerId, key: ContainerKey, value: any): T[] {
    return container.getAllTagged(id, key, value);
  },
  decorate,
  get container() {
    return container;
  }
});

container.bind<JSXService>(LiguiTypes.JSX_SERVICE).toConstantValue(jsxService);
container.bind<RestService>(LiguiTypes.REST_SERVICE).toConstantValue(restService);
container.bind<StoreService>(LiguiTypes.STORE_SERVICE).toConstantValue(storeService);
container.bind<ResourceService>(LiguiTypes.RESOURCE_SERVICE).toConstantValue(resourceService);
container.bind<ContainerService>(LiguiTypes.CONTAINER_SERVICE).toConstantValue(containerService);
container.bind<LocalizationService>(LiguiTypes.LOCALIZATION_SERVICE).toConstantValue(localizationService);
