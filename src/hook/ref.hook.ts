import * as React from 'react';

export const useRef = <T>(initialValue?: T): React.RefObject<T> => {
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
