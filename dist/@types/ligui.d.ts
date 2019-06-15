import 'reflect-metadata';
import autobind from 'autobind-decorator';
import { Context } from './context';
import { Generator } from '@sardonyxwt/utils/generator';
import { DeferredCall } from './extension/function.extension';
import { Parameters, ReturnType } from './extension/data.extension';
import { JSXService } from './service/jsx.service';
import { RestService } from './service/rest.service';
import { ResourceService, ResourceLoader } from './service/resource.service';
import { LocalizationService, LocalizationLoader, Translator } from './service/localization.service';
import { ModuleService, ModuleLoader } from './service/module.service';
import { ContainerKey } from './hook/dependency.hook';
import { DependencyPreloaderHOCOptions } from './hoc/dependency-preloader.hoc';
import { ModuleScopeOptions } from './scope/module.scope';
import { ResourceScopeOptions } from './scope/resource.scope';
import { LocalizationScopeOptions } from './scope/localization.scope';
import { Store, StoreConfig, StoreDevTool } from '@sardonyxwt/state-store';
import { EventBus, EventBusConfig, EventBusDevTool } from '@sardonyxwt/event-bus';
import { Container, interfaces } from 'inversify';
import * as React from 'react';
export { autobind };
export * from 'inversify';
export * from './types';
export * from './context';
export * from './extension/converter.extension';
export * from './extension/entity.extension';
export * from './extension/data.extension';
export * from './extension/function.extension';
export * from './scope/module.scope';
export * from './scope/resource.scope';
export * from './scope/localization.scope';
export * from './service/jsx.service';
export * from './service/localization.service';
export * from './service/resource.service';
export * from './service/rest.service';
export * from './service/module.service';
export * from './hook/data.hook';
export * from './hook/id.hook';
export * from './hook/state.hook';
export * from './hook/pocket.hook';
export * from './hook/ref.hook';
export * from './hook/dependency.hook';
export * from './hook/translator.hook';
export * from './hook/module.hook';
export * from './hook/resource.hook';
export * from './hoc/dependency-preloader.hoc';
export * from '@sardonyxwt/state-store';
export * from '@sardonyxwt/event-bus';
export * from '@sardonyxwt/utils/generator';
export * from '@sardonyxwt/utils/object';
export interface WebLiguiConfig {
    name: string;
    containerOptions: interfaces.ContainerOptions;
    resourceLoader: ResourceLoader;
    resourceScopeOptions: ResourceScopeOptions;
    localizationLoader: LocalizationLoader;
    localizationScopeOptions: LocalizationScopeOptions;
    moduleLoader: ModuleLoader;
    moduleScopeOptions: ModuleScopeOptions;
}
export interface WebLigui {
    readonly jsx: JSXService;
    readonly rest: RestService;
    readonly resource: ResourceService;
    readonly localization: LocalizationService;
    readonly module: ModuleService;
    readonly context: Context;
    readonly store: Store;
    readonly container: Container;
    createStore(config: StoreConfig): Store;
    getStore(storeName: string): Store;
    getState(): {};
    setStoreDevTool(devTool: Partial<StoreDevTool>): void;
    createEventBus(config?: EventBusConfig): EventBus;
    getEventBus(scopeName: string): EventBus;
    setEventBusDevTool(devTool: Partial<EventBusDevTool>): void;
    useId: () => string;
    useRef: <T>(initialValue?: T | null) => [React.RefObject<T>, T];
    useData: <T>(dataResolver: () => T, dataLoader?: () => Promise<T>, dataSync?: (cb: (newData: T) => void) => (() => void | void)) => T;
    useState: <T = any>(scopeName: string, actions?: string[], retention?: number) => T;
    usePocket: <T extends {}>(initialValue: T) => T;
    useDependency: <T = any>(id: interfaces.ServiceIdentifier<T>, keyOrName?: ContainerKey, value?: any) => T;
    useDependencies: <T = any>(id: interfaces.ServiceIdentifier<T>, keyOrName?: ContainerKey, value?: any) => T[];
    useTranslator: (keys: string[], fallbackTranslator?: Translator) => Translator;
    useModule: <T = any>(key: string) => T;
    useResource: <T = any>(key: string) => T;
    withDependencyPreloader: (options: DependencyPreloaderHOCOptions) => <T>(Component: T) => (...args: Parameters<typeof Component>) => ReturnType<typeof Component>;
    clone: <T>(source: T) => T;
    cloneArray: <T>(sources: T[]) => T[];
    cloneArrays: <T>(...sources: (T[])[]) => T[];
    copyArray: <T>(sources: T[]) => T[];
    copyArrays: <T>(...sources: (T[])[]) => T[];
    resolveArray: <T>(source: T | T[]) => T[];
    arrayFrom: <T>(...sources: (T | T[])[]) => T[];
    generateUUID: Generator<string>;
    generateSalt: Generator<string>;
    createUniqueIdGenerator: (prefix: string) => Generator<string>;
    flatten: (data: object) => object;
    unflatten: (data: object) => object;
    stringifyValue: (value: any) => string;
    deepFreeze: <T>(obj: T) => Readonly<T>;
    deferred: DeferredCall;
    charFromHexCode: (hexCode: string) => string;
    resolveFunctionCall: <T extends Function>(func: T, ...flags: boolean[]) => T;
    prepareFunctionCall: <T extends Function>(func: T, ...flags: boolean[]) => ((...args: Parameters<typeof func>) => () => ReturnType<typeof func>);
}
export declare function createNewLiguiInstance(config: WebLiguiConfig): WebLigui;
