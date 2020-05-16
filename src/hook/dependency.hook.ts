import * as React from 'react';
import * as Container from 'bottlejs';

export const createDependencyHook = (
    container: Container.IContainer
) => <T = any>(
    id: string
): T => React.useMemo(() => {
    return container[id] as T;
}, [id]);
