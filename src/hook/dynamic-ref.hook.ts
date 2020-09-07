import * as React from 'react';

/**
 * @type DynamicRefHook
 * @description Hook to update component if ref value changed.
 * @param initialValue {T} Initial value for ref.
 * @returns {React.RefObject<T>}
 */
export type DynamicRefHook = <T>(initialValue?: T) => React.RefObject<T>;

export const useDynamicRef: DynamicRefHook = <T>(
    initialValue?: T,
): React.RefObject<T> => {
    const [current, setCurrent] = React.useState(initialValue);

    return {
        set current(el) {
            setCurrent(() => el);
        },
        get current() {
            return current;
        },
    } as React.RefObject<T>;
};
