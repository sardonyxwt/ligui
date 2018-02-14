import { h, render, AnyComponent } from 'preact';

export interface JSXService {
  register(name: string, component: AnyComponent<any, any>): JSXService;
  render(query: string, component: JSX.Element, isReplaced?: boolean): JSXService;
  create(name: string, props?: {}, children?: JSX.Element | JSX.Element[]): JSX.Element
  remove(query: string);
}

class JsxServiceImpl implements JSXService {

  private components = {};

  register(name: string, component: AnyComponent<any, any>) {
    if (name in this.components) {
      throw new Error(`Component with same name is register.`);
    }
    this.components[name] = component;
    return this;
  }

  render(query: string, component: JSX.Element, isReplaced = false) {
    const nodes = document.querySelectorAll(query);
    for (let i = 0; i < nodes.length; i++) {
      let node = nodes.item(i);
      render(component, node, isReplaced ? node.firstElementChild : null)
    }
    return this;
  }

  create(name: string, props = {}, children: JSX.Element | JSX.Element[] = []) {
    return h(this.components[name] || name, props, children);
  }

  remove(query: string) {
    const nodes = document.querySelectorAll(query);
    for (let i = 0; i < nodes.length; i++) {
      let node = nodes.item(i);
      node.innerHTML = '';
    }
  }

}

export const jsxService: JSXService = new JsxServiceImpl();

export {
  h, render, Component, AnyComponent,
  ComponentProps, ComponentLifecycle, FunctionalComponent, ComponentConstructor
} from 'preact';
