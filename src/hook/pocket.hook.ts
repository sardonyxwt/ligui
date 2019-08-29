import * as React from 'react';
import { createUniqueIdGenerator } from '@sardonyxwt/utils/generator';

const pocketIdGenerator = createUniqueIdGenerator('PocketId');

const pockets: { [id: string]: object } = {};

export const usePocket = <T extends {}>(
    initialValue: T
): T => {
    const pocketId = React.useMemo(() => pocketIdGenerator(), []);

    if (!(pocketId in pockets)) {
        pockets[pocketId] = initialValue;
    }

    React.useEffect(() => {
        return () => delete pockets[pocketId];
    }, []);

    return pockets[pocketId] as T;
};
