import 'reflect-metadata';
import { Context } from './context';
import { JSXService } from './service/jsx.service';
import { ResourceDataLoader, ResourceService } from './service/resource.service';
import { InternationalizationService, TranslateUnitDataLoader } from './service/internationalization.service';
import { ModuleBodyLoader, ModuleService } from './service/module.service';
import { ContainerKey } from './hook/dependency.hook';
import { InternationalizationHookReturnType } from './hook/internationalization.hook';
import { ModuleScopeOptions } from './scope/module.scope';
import { ResourceScopeOptions } from './scope/resource.scope';
import { InternationalizationScopeOptions } from './scope/internationalization.scope';
import { Store, StoreConfig, StoreDevTool } from '@sardonyxwt/state-store';
import { EventBus, EventBusConfig, EventBusDevTool } from '@sardonyxwt/event-bus';
import { Container, interfaces } from 'inversify';
import * as React from 'react';
export * from 'inversify';
export * from './types';
export * from './context';
export * from './scope/module.scope';
export * from './scope/resource.scope';
export * from './scope/internationalization.scope';
export * from './service/jsx.service';
export * from './service/internationalization.service';
export * from './service/resource.service';
export * from './service/module.service';
export * from './hook/current.hook';
export * from './hook/data.hook';
export * from './hook/id.hook';
export * from './hook/state.hook';
export * from './hook/pocket.hook';
export * from './hook/ref.hook';
export * from './hook/dependency.hook';
export * from './hook/internationalization.hook';
export * from './hook/module.hook';
export * from './hook/resource.hook';
export * from '@sardonyxwt/event-bus';
export * from '@sardonyxwt/state-store';
export interface LiguiConfig {
    name: string;
    containerOptions: interfaces.ContainerOptions;
    moduleScopeOptions: ModuleScopeOptions;
    resourceScopeOptions: ResourceScopeOptions;
    internationalizationScopeOptions: InternationalizationScopeOptions;
    moduleLoaders?: ModuleBodyLoader[];
    resourceLoaders?: ResourceDataLoader[];
    internationalizationLoaders?: TranslateUnitDataLoader[];
}
export interface Ligui {
    readonly jsx: JSXService;
    readonly resource: ResourceService;
    readonly internationalization: InternationalizationService;
    readonly module: ModuleService;
    readonly context: Context;
    readonly store: Store;
    readonly container: Container;
    createStore(config: StoreConfig): Store;
    isStoreExist(storeName: string): boolean;
    getStore(storeName: string): Store;
    getState(): {};
    setStoreDevTool(devTool: Partial<StoreDevTool>): void;
    createEventBus(config?: EventBusConfig): EventBus;
    isEventBusExist(storeName: string): boolean;
    getEventBus(scopeName: string): EventBus;
    setEventBusDevTool(devTool: Partial<EventBusDevTool>): void;
    useId: () => string;
    useRef: <T>(initialValue?: T | null) => [React.RefObject<T>, T];
    useData: <T>(dataResolver: () => T, dataLoader?: () => Promise<T>, dataSync?: (cb: (newData: T) => void) => (() => void | void)) => T;
    useState: <T = any>(scopeName: string, actions?: string[], retention?: number) => T;
    usePocket: <T extends {}>(initialValue: T) => T;
    useCurrent: <T>(value: T) => [T, (newValue: T) => void];
    useDependency: <T = any>(id: interfaces.ServiceIdentifier<T>, keyOrName?: ContainerKey, value?: any) => T;
    useDependencies: <T = any>(id: interfaces.ServiceIdentifier<T>, keyOrName?: ContainerKey, value?: any) => T[];
    useModule: <T = any>(key: string, context?: string) => T;
    useResource: <T = any>(key: string, context?: string) => T;
    useI18n: (keys: string[], context?: string) => InternationalizationHookReturnType;
}
export declare function createNewLiguiInstance(config: LiguiConfig): Ligui;
//# sourceMappingURL=ligui.d.ts.map