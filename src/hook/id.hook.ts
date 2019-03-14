import * as React from 'react';
import { createUniqueIdGenerator } from '@sardonyxwt/utils/generator';

const idHookListenerIdGenerator = createUniqueIdGenerator('ResourcesHook');

export type IdHookType = () => string;

export function IdHook (): string {
  return React.useMemo(() => idHookListenerIdGenerator(), [true]);
}
