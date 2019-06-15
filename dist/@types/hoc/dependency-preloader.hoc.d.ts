import * as React from 'react';
import { Container } from 'inversify';
import { Parameters, ReturnType } from '../extension/data.extension';
export interface DependencyPreloaderHOCOptions {
    resourceKeys?: string[];
    localizationKeys?: string[];
    moduleKeys?: string[];
    placeholder?: (isLoaded: any, component: React.ReactNode) => React.ReactNode;
}
export declare const createDependencyPreloaderHOC: (container: Container) => ({ resourceKeys, localizationKeys, moduleKeys, placeholder }: DependencyPreloaderHOCOptions) => <T>(Component: T) => (...args: Parameters<T>) => ReturnType<T>;
