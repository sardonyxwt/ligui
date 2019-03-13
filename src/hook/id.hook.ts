import * as React from 'react';
import { uniqueId } from '@sardonyxwt/utils/generator';

export type IdHookType = (prefix?: string, useSeed?: boolean) => string;

export function IdHook (prefix = '', useSeed = false): string {
  return React.useMemo(() => uniqueId(prefix, useSeed), [true]);
}
