import * as React from 'react';
import { createUniqueIdGenerator } from '@sardonyxwt/utils/generator';

export type PocketHookType = <T extends {}>(initialValue: T) => T;

const pocketIdGenerator = createUniqueIdGenerator('PocketId');

const pockets: { [id: string]: object } = {};

export function usePocket<T extends {}>(initialValue: T): T {
  const pocketId = React.useMemo(() => pocketIdGenerator(), []);

  if (!(pocketId in pockets)) {
    pockets[pocketId] = initialValue;
  }

  React.useEffect(() => {
    return () => delete pockets[pocketId];
  }, []);

  return pockets[pocketId] as T;
}
