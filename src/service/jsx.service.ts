import * as React from 'react';
import * as ReactDOM from 'react-dom';

export interface CommonProps {
    id?: string;
    className?: string;
    style?: React.CSSProperties;
}

export interface ChildrenProps<
    T extends unknown | unknown[] = React.ReactNode
> {
    children?: T extends (infer U)[] ? U | U[] : T;
}

export type DOMEvent =
    | MouseEvent
    | KeyboardEvent
    | TouchEvent
    | React.MouseEvent
    | React.TouchEvent
    | React.KeyboardEvent;

export interface JSXService {
    registerFactory<T extends Record<string, unknown>>(
        name: string,
        factory: React.Factory<T>,
    ): void;

    node<T extends Record<string, unknown>>(
        name: string,
        props?: T,
        ...children: React.ReactNode[]
    ): React.ReactElement<T>;

    render<T extends Record<string, unknown>>(
        container: Element,
        element: React.ReactElement<T>,
    );

    hydrate<T extends Record<string, unknown>>(
        container: Element,
        element: React.ReactElement<T>,
    );

    renderComponent<T extends Record<string, unknown>>(
        container: Element,
        name: string,
        props?: T,
        ...children: React.ReactNode[]
    ): void;

    hydrateComponent<T extends Record<string, unknown>>(
        container: Element,
        name: string,
        props?: T,
        ...children: React.ReactNode[]
    ): void;

    classes(...classes: (string | [string, boolean])[]): string;

    styles(
        ...styles: (React.CSSProperties | [React.CSSProperties, boolean])[]
    ): React.CSSProperties;

    eventTrap(evt: DOMEvent, includeNative?: boolean): void;

    isModifiedEvent(evt: DOMEvent): boolean;

    mergeRefs<T>(...refs: Array<React.Ref<T>>): (ref: T) => void;
}

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

export const eventTrap = (evt: DOMEvent, includeNative = true): void => {
    evt.preventDefault();
    evt.stopPropagation();
    if (evt['nativeEvent'] && includeNative) {
        evt['nativeEvent'].preventDefault();
        evt['nativeEvent'].stopPropagation();
    }
};

export const isModifiedEvent = (evt: DOMEvent): boolean => {
    return !!(evt.metaKey || evt.altKey || evt.ctrlKey || evt.shiftKey);
};

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

export class JSXServiceImpl implements JSXService {
    private _factories: Record<
        string,
        React.Factory<Record<string, unknown>>
    > = {};

    classes = classes;
    styles = styles;
    eventTrap = eventTrap;
    isModifiedEvent = isModifiedEvent;
    mergeRefs = mergeRefs;

    hydrate<T extends Record<string, unknown>>(
        container: Element,
        element: React.ReactElement<T>,
    ): void {
        ReactDOM.hydrate(element, container);
    }

    hydrateComponent<T extends Record<string, unknown>>(
        container: Element,
        name: string,
        props?: T,
        ...children: React.ReactNode[]
    ): void {
        ReactDOM.hydrate(this.node(name, props, children), container);
    }

    node<T extends Record<string, unknown>>(
        name: string,
        props?: T,
        ...children: React.ReactNode[]
    ): React.ReactElement<T> {
        if (name in this._factories) {
            return (this._factories[name] as React.Factory<T>)(props, children);
        }
        return React.createElement(name, props, children);
    }

    registerFactory<T extends Record<string, unknown>>(
        name: string,
        factory: React.Factory<T>,
    ): void {
        if (name in this._factories) {
            throw new Error(`Factory with same name is register.`);
        }
        this._factories[name] = factory;
    }

    render<T extends Record<string, unknown>>(
        container: Element,
        element: React.ReactElement<T>,
    ): void {
        ReactDOM.render(element, container);
    }

    renderComponent<T extends Record<string, unknown>>(
        container: Element,
        name: string,
        props?: T,
        ...children: React.ReactNode[]
    ): void {
        ReactDOM.render(this.node(name, props, children), container);
    }
}
