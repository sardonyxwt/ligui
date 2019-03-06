import * as React from 'react';
import { ContainerId, ContainerKey, ContainerService } from '..';

const isNamedDependency = (name?: ContainerKey) => typeof name !== 'undefined';
const isTaggedDependency = (key?: ContainerKey, value?: any) => typeof key !== 'undefined' && typeof value !== 'undefined';

export type DependencyHookType = <T = any>(id: ContainerId<T>, keyOrName?: ContainerKey, value?: any) => T;
export type DependenciesHookType = <T = any>(id: ContainerId<T>, keyOrName?: ContainerKey, value?: any) => T[];

export const createDependencyHookInstance = (containerService: ContainerService): DependencyHookType =>
  <T = any>(id: ContainerId<T>, keyOrName?: ContainerKey, value?: any): T => React.useMemo(() => {
    if (isTaggedDependency(keyOrName, value)) {
      return containerService.resolveTagged<T>(id, keyOrName, value);
    }
    if (isNamedDependency(keyOrName)) {
      return containerService.resolveNamed<T>(id, keyOrName);
    }
    return containerService.resolve<T>(id);
  }, [id, keyOrName, value]);

export const createDependenciesHookInstance = (containerService: ContainerService): DependenciesHookType =>
  <T = any>(id: ContainerId<T>, keyOrName?: ContainerKey, value?: any): T[] => React.useMemo(() => {
    if (isTaggedDependency(keyOrName, value)) {
      return containerService.resolveAllTagged<T>(id, keyOrName, value);
    }
    if (isNamedDependency(keyOrName)) {
      return containerService.resolveAllNamed<T>(id, keyOrName);
    }
    return containerService.resolveAll<T>(id);
  }, [id, keyOrName, value]);

