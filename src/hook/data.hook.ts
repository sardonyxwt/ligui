import * as React from 'react';

export const useData = <T>(
    dataResolver: () => T,
    dataLoader?: () => Promise<T>,
    dataSync?: (cb: (newData: T) => void) => (() => void) | void
) => {
    const [data, setData] = React.useState<T>(dataResolver);

    React.useEffect(() => {
        if (!data && dataLoader) {
            Promise.resolve(dataLoader()).then(setData);
        }
    }, []);

    React.useEffect(() => {
        if (dataSync) {
            const unsubscribeCallback = dataSync(() => setData(dataResolver()));
            if (typeof unsubscribeCallback === 'function') {
                return unsubscribeCallback;
            }
        }
    });

    return data;
};
