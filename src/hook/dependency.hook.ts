import * as React from 'react';
import { interfaces } from 'inversify';
import { Context } from '@src/context';

export type ContainerKey = string | number | symbol;
export type ContainerId<T = any> = string | symbol | interfaces.Newable<T> | interfaces.Abstract<T>;

const isNamedDependency = (name?: ContainerKey) => typeof name !== 'undefined';
const isTaggedDependency = (key?: ContainerKey, value?: any) => typeof key !== 'undefined' && typeof value !== 'undefined';

export type DependencyHookType = <T = any>(context: Context, id: ContainerId<T>, keyOrName?: ContainerKey, value?: any) => T;
export type DependenciesHookType = <T = any>(context: Context, id: ContainerId<T>, keyOrName?: ContainerKey, value?: any) => T[];

export function useDependency <T = any>(context: Context, id: ContainerId<T>, keyOrName?: ContainerKey, value?: any): T {
  return React.useMemo(() => {
    if (isTaggedDependency(keyOrName, value)) {
      return context.container.getTagged<T>(id, keyOrName, value);
    }
    if (isNamedDependency(keyOrName)) {
      return context.container.getNamed<T>(id, keyOrName);
    }
    return context.container.get<T>(id);
  }, [id, keyOrName, value]);
}

export function useDependencies <T = any>(context: Context, id: ContainerId<T>, keyOrName?: ContainerKey, value?: any): T[] {
  return React.useMemo(() => {
    if (isTaggedDependency(keyOrName, value)) {
      return context.container.getAllTagged<T>(id, keyOrName, value);
    }
    if (isNamedDependency(keyOrName)) {
      return context.container.getAllNamed<T>(id, keyOrName);
    }
    return context.container.getAll<T>(id);
  }, [id, keyOrName, value]);
}
