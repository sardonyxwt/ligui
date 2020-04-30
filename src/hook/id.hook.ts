import * as React from 'react';
import { createUniqueIdGenerator } from '@sardonyxwt/utils/generator';

const idHookListenerIdGenerator = createUniqueIdGenerator('IdHook');

export const useId = (): string => React.useMemo(() => idHookListenerIdGenerator(), []);
