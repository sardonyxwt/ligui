import * as React from 'react';

/**
 * @interface CommonProps
 * @description Default react component props.
 */
export interface CommonProps {
    id?: string;
    className?: string;
    style?: React.CSSProperties;
}

/**
 * @interface ChildrenProps
 * @description React children specification for components.
 */
export interface ChildrenProps<
    T extends unknown | unknown[] = React.ReactNode
> {
    children?: T extends (infer U)[] ? U | U[] : T;
}

/**
 * @type DOMEvent
 * @description Any react/dom event type.
 */
export type DOMEvent =
    | MouseEvent
    | KeyboardEvent
    | TouchEvent
    | React.MouseEvent
    | React.TouchEvent
    | React.KeyboardEvent;

/**
 * @interface JSXService
 * @description Add widget system and utils methods for react components.
 */

/**
 * @method classes
 * @description Used to select only needed classes.
 * @param classes {(string | [string, boolean])[]} styles classes to be selected.
 * @returns {string}
 */
export const classes = (...classes: (string | [string, boolean])[]): string => {
    const resultClasses: string[] = [];
    classes
        .filter((it) => !!it)
        .forEach((clazz) => {
            if (typeof clazz === 'string') {
                resultClasses.push(clazz);
            } else {
                const [className, isUsed] = clazz;
                if (isUsed) {
                    resultClasses.push(className);
                }
            }
        });
    return resultClasses.join(' ');
};

/**
 * @method styles
 * @description Used to select only needed react styles.
 * @param styles {(React.CSSProperties | [React.CSSProperties, boolean])[]}
 * react styles to be selected.
 * @returns {React.CSSProperties}
 */
export const styles = (
    ...styles: (React.CSSProperties | [React.CSSProperties, boolean])[]
): React.CSSProperties => {
    const resultStyles: React.CSSProperties[] = [];
    styles
        .filter((it) => !!it)
        .forEach((style) => {
            if (Array.isArray(style)) {
                const [styleProperties, isUsed] = style;
                if (isUsed) {
                    resultStyles.push(styleProperties);
                }
            } else {
                resultStyles.push(style);
            }
        });
    return resultStyles.reduce((prev, current) => Object.assign(prev, current));
};

/**
 * @method eventTrap
 * @description Trap react event with include native.
 * @param evt {DOMEvent} Event to trap.
 * @param includeNative {boolean} Include native event to trap flag.
 */
export const eventTrap = (evt: DOMEvent, includeNative = true): void => {
    evt.preventDefault();
    evt.stopPropagation();
    if (evt['nativeEvent'] && includeNative) {
        evt['nativeEvent'].preventDefault();
        evt['nativeEvent'].stopPropagation();
    }
};

/**
 * @method isModifiedEvent
 * @description Util method to detect modified event.
 * @example Command keys pressed
 * @param evt {DOMEvent} Any Event
 * @returns {boolean}
 */
export const isModifiedEvent = (evt: DOMEvent): boolean => {
    return !!(evt.metaKey || evt.altKey || evt.ctrlKey || evt.shiftKey);
};

/**
 * @method mergeRefs
 * @description Merge refs to one ref for one place used.
 * @param refs React refs to use in one place.
 * @returns {(ref: T) => void} React ref callback.
 */
export const mergeRefs = <T>(...refs: Array<React.Ref<T>>) => (
    ref: T,
): void => {
    refs.filter((resolvedRef) => !!resolvedRef).map((resolvedRef) => {
        if (typeof resolvedRef === 'function') {
            resolvedRef(ref);
        } else {
            (resolvedRef as React.MutableRefObject<T>).current = ref;
        }
    });
};
