import * as React from 'react';
import { ResourceService } from '../service/resource.service';
import { LocalizationService } from '../service/localization.service';
import { ModuleService } from '../service/module.service';
import { Parameters, ReturnType } from '../extension/data';

export interface DependencyPreloaderHOCOptions {
  resourceKeys?: string[];
  localizationKeys?: string[];
  moduleKeys?: string[];
  placeholder?: (isLoaded, component: React.ReactElement) => React.ReactElement;
}

export const createDependencyPreloaderHOC = (
  resourceService: ResourceService,
  localizationService: LocalizationService,
  moduleService: ModuleService,
) => (
  {
    resourceKeys = null,
    localizationKeys = null,
    moduleKeys = null,
    placeholder = (isLoaded, component) => isLoaded ? component : null
  }: DependencyPreloaderHOCOptions
) => <T>(
  Component: T
) => (
  ...args: Parameters<typeof Component>
): ReturnType<typeof Component> => {
  const isLoaded = (keys: string[]) => !Array.isArray(keys) || (Array.isArray(keys) && !keys.length);

  const [isResourcesLoaded, setIsResourcesLoaded] = React.useState(() => isLoaded(resourceKeys));
  const [isLocalizationsLoaded, setIsLocalizationLoaded] = React.useState(() => isLoaded(localizationKeys));
  const [isModulesLoaded, setIsModulesLoaded] = React.useState(() => isLoaded(moduleKeys));

  const isLoadedComplete = isResourcesLoaded && isLocalizationsLoaded && isModulesLoaded;

  if (!isResourcesLoaded) {
    Promise.all(resourceKeys.map(it => resourceService.loadResources(it)))
      .then(() => setIsResourcesLoaded(true));
  }

  if (!isLocalizationsLoaded) {
    Promise.all(localizationKeys.map(it => localizationService.loadLocalization(it)))
      .then(() => setIsLocalizationLoaded(true));
  }

  if (!isModulesLoaded) {
    Promise.all(moduleKeys.map(it => moduleService.loadModule(it)))
      .then(() => setIsModulesLoaded(true));
  }

  return placeholder(
    isLoadedComplete,
    isLoadedComplete
      ? React.createElement(Component as any, args as any, args['children'])
      : null
  ) as any as ReturnType<typeof Component>;
};
