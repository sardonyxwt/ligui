import {render} from 'react-dom';
import {createElement} from 'react';

export interface JSXService {
  register(name: string, component): JSXService;

  render(query: string, component): JSXService;

  create(name: string, props?, children?: JSX.Element | JSX.Element[]);
}

class JSXServiceImpl implements JSXService {

  protected components = {};

  register(name: string, component) {
    if (name in this.components) {
      throw new Error(`Component with same name is register.`);
    }
    this.components[name] = component;
    return this;
  }

  render(query: string, component) {
    const nodes = document.querySelectorAll(query);
    for (let i = 0; i < nodes.length; i++) {
      let node = nodes.item(i);
      render(component, node)
    }
    return this;
  }

  create(name: string, props = {}, children: JSX.Element | JSX.Element[] = []) {
    return createElement(this.components[name] || name, props, children);
  }

}

export const jsxService: JSXService = new JSXServiceImpl();
