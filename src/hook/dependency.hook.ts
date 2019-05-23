import * as React from 'react';
import { Container, interfaces } from 'inversify';

export type ContainerKey = string | number | symbol;

const isNamedDependency = (name?: ContainerKey) => typeof name !== 'undefined';
const isTaggedDependency = (key?: ContainerKey, value?: any) => typeof key !== 'undefined' && typeof value !== 'undefined';

export const createDependencyHook = (
  container: Container
) => <T = any>(
  id: interfaces.ServiceIdentifier<T>,
  keyOrName?: ContainerKey,
  value?: any
): T => React.useMemo(() => {
  if (isTaggedDependency(keyOrName, value)) {
    return container.getTagged<T>(id, keyOrName, value);
  }
  if (isNamedDependency(keyOrName)) {
    return container.getNamed<T>(id, keyOrName);
  }
  return container.get<T>(id);
}, [id, keyOrName, value]);

export const createDependenciesHook = (
  container: Container
) => <T = any>(
  id: interfaces.ServiceIdentifier<T>,
  keyOrName?: ContainerKey,
  value?: any
): T[] => React.useMemo(() => {
  if (isTaggedDependency(keyOrName, value)) {
    return container.getAllTagged<T>(id, keyOrName, value);
  }
  if (isNamedDependency(keyOrName)) {
    return container.getAllNamed<T>(id, keyOrName);
  }
  return container.getAll<T>(id);
}, [id, keyOrName, value]);
