import * as React from 'react';
import { createUniqueIdGenerator } from '@sardonyxwt/utils/generator';

const idHookListenerIdGenerator = createUniqueIdGenerator('ResourcesHook');

export function useId (): string {
  return React.useMemo(() => idHookListenerIdGenerator(), [true]);
}
