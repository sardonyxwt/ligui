import * as React from 'react';
import { ResourceService } from '../service/resource.service';
import { LocalizationService } from '../service/localization.service';
import { ModuleService } from '../service/module.service';
import { Parameters, ReturnType } from '../extension/data';
export interface DependencyPreloaderHOCOptions {
    resourceKeys?: string[];
    localizationKeys?: string[];
    moduleKeys?: string[];
    placeholder?: (isLoaded: any, component: React.ReactElement) => React.ReactElement;
}
export declare const createDependencyPreloaderHOC: (resourceService: ResourceService, localizationService: LocalizationService, moduleService: ModuleService) => ({ resourceKeys, localizationKeys, moduleKeys, placeholder }: DependencyPreloaderHOCOptions) => <T>(Component: T) => (...args: Parameters<T>) => ReturnType<T>;
