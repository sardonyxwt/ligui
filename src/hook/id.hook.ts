import * as React from 'react';
import { uniqueId } from '@sardonyxwt/utils/generator';

export type IdHookType = (prefix?: string, useSeed?: boolean) => string;

export const createIdHookInstance = (): IdHookType => (prefix = '', useSeed = false): string =>
  React.useMemo(() => uniqueId(prefix, useSeed), [true]);
