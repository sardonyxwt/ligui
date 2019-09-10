import * as React from 'react';
import { createUniqueIdGenerator } from '@sardonyxwt/utils/generator';

const pocketIdGenerator = createUniqueIdGenerator('PocketId');

const pockets = new Map<string, object>();

export const usePocket = <T extends {}>(
    initialValue: T
): T => {
    const pocketId = React.useMemo(() => pocketIdGenerator(), []);

    if (!pockets.has(pocketId)) {
        pockets.set(pocketId, initialValue);
    }

    React.useEffect(() => {
        return () => pockets.delete(pocketId);
    }, []);

    return pockets.get(pocketId) as T;
};
