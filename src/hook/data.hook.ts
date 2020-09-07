import * as React from 'react';

export type SyncDataUnsubscribeCallback = () => Promise<void> | void;

/**
 * @type DataHook
 * @description React hook to manage data.
 * @param dataResolver {() => T}
 * Resolver for data. Resolver is sync func.
 * @param dataLoader {() => Promise<T>}
 * Loader for data loading if resolver returns null, undefined.
 * @param dataSync {(cb: (newData: T) => void) => SyncDataUnsubscribeCallback | void}
 * Sync callback for data for data syncing.
 */
export type DataHook = <T>(
    dataResolver: () => T,
    dataLoader?: () => Promise<T>,
    dataSync?: (cb: (newData: T) => void) => SyncDataUnsubscribeCallback | void,
) => T;

export const useData: DataHook = <T>(
    dataResolver: () => T,
    dataLoader?: () => Promise<T>,
    dataSync?: (cb: (newData: T) => void) => SyncDataUnsubscribeCallback | void,
): T => {
    const [data, setData] = React.useState<T>(() => dataResolver?.());

    React.useEffect(() => {
        if (data === undefined && dataLoader) {
            Promise.resolve(dataLoader()).then((data) => setData(() => data));
        }
    }, []);

    React.useEffect(() => {
        if (dataSync) {
            const unsubscribeCallback = dataSync(() =>
                setData(() => dataResolver?.()),
            );
            if (typeof unsubscribeCallback === 'function') {
                return unsubscribeCallback;
            }
        }
    }, []);

    return data;
};
