import * as React from 'react';
import * as ReactDOM from 'react-dom';

export interface JSXService {
  registerFactory<T extends {}>(name: string, factory: React.Factory<T>): JSXService;
  node<T>(name: string, props: T, children?: React.ReactNode[]): React.ReactElement<T>;
  render<T>(container: Element, element: React.ReactElement<T>);
}

class JSXServiceImpl implements JSXService {

  private factories: {[factoryName: string]: React.Factory<{}>} = {};

  registerFactory<T extends {}>(name: string, factory: React.Factory<T>) {
    if (name in this.factories) {
      throw new Error(`Factory with same name is register.`);
    }
    if (name in this) {
      throw new Error(`Factory not registered, because name: ${name} is reserved.`);
    }
    const capitalizeFirstLetterActionName = () => {
      return name.charAt(0).toUpperCase() + name.slice(1);
    };
    this.factories[name] = factory;
    this[`render${capitalizeFirstLetterActionName()}`] = (container: Element, props, children: React.ReactNode[]) => {
      this.render(container, factory(props, children))
    };
    return this;
  }

  node<T>(name: string, props: T, children: React.ReactNode[]) {
    if (name in this.factories) {
      return (this.factories[name] as React.Factory<T>)(props, children);
    }
    return React.createElement(name, props, children);
  }

  render<T>(container: Element, element: React.ReactElement<T>) {
    ReactDOM.render(element, container)
  }

}

export const jsxService: JSXService = new JSXServiceImpl();
