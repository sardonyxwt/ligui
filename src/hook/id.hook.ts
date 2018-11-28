import * as React from 'react';
import { uniqueId } from '@sardonyxwt/utils/generator';

export function useId(prefix = '', useSeed = false): string {
  return React.useMemo(() => uniqueId(prefix, useSeed), [true]);
}

