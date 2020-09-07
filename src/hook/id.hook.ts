import * as React from 'react';
import { createUniqueIdGenerator } from '@source/util/generator.util';

const idHookListenerIdGenerator = createUniqueIdGenerator('IdHook');

/**
 * @type IdHook
 * @description React hook for unique id generation.
 * @returns {string} Unique id.
 */
export type IdHook = () => string;

export const useId: IdHook = (): string =>
    React.useMemo(() => idHookListenerIdGenerator(), []);
