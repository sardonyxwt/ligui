import * as React from 'react';

export const useCurrent = <T>(
    value: T
): [T, (newValue: T) => void] => {
    const valueRef = React.useRef<T>(null);

    valueRef.current = value;

    return [
        valueRef.current,
        newValue => valueRef.current = newValue
    ];
};
