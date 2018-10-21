import * as React from 'react';

export interface JSXService {
  registerFactory<T extends {}>(name: string, factory: React.Factory<T>): JSXService;
  node<T>(name: string, props: T, children: React.ReactNode[]): React.ReactElement<T>;
}

class JSXServiceImpl implements JSXService {

  private factories: {[factoryName: string]: React.Factory<{}>} = {};

  registerFactory<T extends {}>(name: string, factory: React.Factory<T>) {
    if (name in this.factories) {
      throw new Error(`Factory with same name is register.`);
    }
    this.factories[name] = factory;
    return this;
  }

  node<T>(name: string, props: T, children: React.ReactNode[]) {
    if (name in this.factories) {
      return (this.factories[name] as React.Factory<T>)(props, children);
    }
    return React.createElement(name, props, children);
  }

}

export const jsxService: JSXService = new JSXServiceImpl();
