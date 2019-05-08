import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { injectable } from 'inversify';
import autobind from 'autobind-decorator';

export interface CommonProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface ChildrenProps<T extends any | any[] = React.ReactNode> {
  children?: T extends (infer U)[] ? U | U[] : T;
}

export interface JSXService {
  registerFactory<T extends {}>(name: string, factory: React.Factory<T>): void;
  node<T extends {}>(name: string, props?: T, ...children: React.ReactNode[]): React.ReactElement<T>;
  render<T extends {}>(container: Element, element: React.ReactElement<T>);
  hydrate<T extends {}>(container: Element, element: React.ReactElement<T>);
  renderComponent<T extends {}>(container: Element, name: string, props?: T, ...children: React.ReactNode[]): void;
  hydrateComponent<T extends {}>(container: Element, name: string, props?: T, ...children: React.ReactNode[]): void;
  classes(...classes: (string | [string, boolean])[]): string;
  eventTrap(evt: MouseEvent | KeyboardEvent | TouchEvent
    | React.MouseEvent | React.TouchEvent | React.KeyboardEvent, includeNative?: boolean): void;
  mergeRefs<T>(...refs: Array<React.Ref<T>>): (ref: T) => void;
}

export const classes = (...classes: (string | [string, boolean])[]) => {
  const resultClasses: string[] = [];
  classes.filter(it => !!it).forEach(clazz => {
    if (typeof clazz === 'string') {
      resultClasses.push(clazz);
    } else {
      const [className, isUsed] = clazz;
      if (isUsed) {
        resultClasses.push(className);
      }
    }
  });
  return resultClasses.join(' ')
};

export const eventTrap = (evt: MouseEvent | KeyboardEvent | TouchEvent
  | React.MouseEvent | React.TouchEvent | React.KeyboardEvent, includeNative = true) => {
  evt.preventDefault();
  evt.stopPropagation();
  if (evt['nativeEvent'] && includeNative) {
    evt['nativeEvent'].preventDefault();
    evt['nativeEvent'].stopPropagation();
  }
};

export const mergeRefs = <T>(...refs: Array<React.Ref<T>>) => (ref: T) => {
  refs.filter(resolvedRef => !!resolvedRef).map(resolvedRef => {
    if (typeof resolvedRef === 'function') {
      resolvedRef(ref);
    } else {
      (resolvedRef as any).current = ref;
    }
  });
};

@injectable()
@autobind
export class JSXServiceImpl implements JSXService {

  private _factories: {[factoryName: string]: React.Factory<{}>} = {};

  classes = classes;
  eventTrap = eventTrap;
  mergeRefs = mergeRefs;

  hydrate<T extends {}>(container: Element, element: React.ReactElement<T>) {
    ReactDOM.hydrate(element, container);
  }

  hydrateComponent<T extends {}>(container: Element, name: string, props?: T, ...children: React.ReactNode[]): void {
    ReactDOM.hydrate(this.node(name, props, children), container);
  }

  node<T extends {}>(name: string, props?: T, ...children: React.ReactNode[]): React.ReactElement<T> {
    if (name in this._factories) {
      return (this._factories[name] as React.Factory<T>)(props, children);
    }
    return React.createElement(name, props, children);
  }

  registerFactory<T extends {}>(name: string, factory: React.Factory<T>): void {
    if (name in this._factories) {
      throw new Error(`Factory with same name is register.`);
    }
    this._factories[name] = factory;
  }

  render<T extends {}>(container: Element, element: React.ReactElement<T>) {
    ReactDOM.render(element, container);
  }

  renderComponent<T extends {}>(container: Element, name: string, props?: T, ...children: React.ReactNode[]): void {
    ReactDOM.render(this.node(name, props, children), container)
  }

}
