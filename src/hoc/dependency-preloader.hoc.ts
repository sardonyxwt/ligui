import * as React from 'react';
import { ResourceService } from '../service/resource.service';
import { LocalizationService } from '../service/localization.service';
import { ModuleService } from '../service/module.service';
import { Parameters, ReturnType } from '../extension/data';

export interface DependencyPreloaderHOCOptions {
  resourceKeys?: string[];
  localizationKeys?: string[];
  moduleKeys?: string[];
  placeholder?: (isLoaded, component: React.ReactNode) => React.ReactNode;
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

  const [isResourcesLoaded, setIsResourcesLoaded] = React.useState(() =>
    !Array.isArray(resourceKeys)
    || resourceKeys.length === 0
    || resourceKeys.map(resourceService.isResourceLoaded).reduce((v1, v2) => v1 && v2));

  const [isLocalizationsLoaded, setIsLocalizationLoaded] = React.useState(() =>
    !Array.isArray(localizationKeys)
    || localizationKeys.length === 0
    || localizationKeys.map(localizationService.isLocalizationLoaded).reduce((v1, v2) => v1 && v2));

  const [isModulesLoaded, setIsModulesLoaded] = React.useState(() =>
    !Array.isArray(moduleKeys)
    || moduleKeys.length === 0
    || moduleKeys.map(moduleService.isModuleLoaded).reduce((v1, v2) => v1 && v2));

  const isLoadedComplete = isResourcesLoaded && isLocalizationsLoaded && isModulesLoaded;

  if (!isResourcesLoaded) {
    Promise.all(
      resourceKeys
        .filter(it => !resourceService.isResourceLoaded(it))
        .map(it => resourceService.loadResources(it)))
      .then(() => setIsResourcesLoaded(true));
  }

  if (!isLocalizationsLoaded) {
    Promise.all(
      localizationKeys
        .filter(it => !localizationService.isLocalizationLoaded(it))
        .map(it => localizationService.loadLocalization(it)))
      .then(() => setIsLocalizationLoaded(true));
  }

  if (!isModulesLoaded) {
    Promise.all(
      moduleKeys
        .filter(it => !moduleService.isModuleLoaded(it))
        .map(it => moduleService.loadModule(it)))
      .then(() => setIsModulesLoaded(true));
  }

  return placeholder(
    isLoadedComplete,
    isLoadedComplete
      ? React.createElement(Component as any, args[0] as any, (args[0] as any)['children'])
      : null
  ) as any as ReturnType<typeof Component>;
};
