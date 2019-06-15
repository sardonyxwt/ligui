import * as React from 'react';
import { createUniqueIdGenerator } from '@sardonyxwt/utils/generator';

const idHookListenerIdGenerator = createUniqueIdGenerator('ResourcesHook');

export const useId = (): string => React.useMemo(() => idHookListenerIdGenerator(), [true]);
