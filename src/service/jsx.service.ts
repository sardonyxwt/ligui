import * as React from 'react';
import * as ReactDOM from 'react-dom';

export interface JSXService {
  registerFactory<T extends {}>(name: string, factory: React.Factory<T>): JSXService;
  node<T extends {}>(name: string, props?: T, ...children: React.ReactNode[]): React.ReactElement<T>;
  render<T extends {}>(container: Element, element: React.ReactElement<T>);
  renderComponent<T extends {}>(container: Element, name: string, props?: T, ...children: React.ReactNode[]);
  classes(classes: (string | [string, boolean])[]): string;
}

const factories: {[factoryName: string]: React.Factory<{}>} = {};

const registerFactory = <T extends {}>(name: string, factory: React.Factory<T>) => {
  if (name in factories) {
    throw new Error(`Factory with same name is register.`);
  }
  if (name in this) {
    throw new Error(`Factory not registered, because name: ${name} is reserved.`);
  }
  const capitalizeFirstLetterActionName = () => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };
  factories[name] = factory;
  this[`render${capitalizeFirstLetterActionName()}`] = (container: Element, props, children: React.ReactNode[]) => {
    this.render(container, factory(props, children))
  };
  return this;
};

const node = <T extends {}>(name: string, props?: T, ...children: React.ReactNode[]) => {
  if (name in factories) {
    return (factories[name] as React.Factory<T>)(props, children);
  }
  return React.createElement(name, props, children);
};

const render = <T extends {}>(container: Element, element: React.ReactElement<T>) => {
  ReactDOM.render(element, container)
};

const renderComponent = <T extends {}>(container: Element, name: string, props?: T, ...children: React.ReactNode[]) => {
  ReactDOM.render(this.node(name, props, children), container)
};

const classes = (classes: (string | [string, boolean])[]) => {
  const resultClasses: string[] = [];
  classes.forEach(clazz => {
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

export const jsxService: JSXService = Object.freeze({
  registerFactory,
  node,
  render,
  renderComponent,
  classes
});
