import { h, render, AnyComponent } from 'preact';

export class JSXManager {

  private static instance: JSXManager;
  private components = {};

  private constructor() {
  }

  static get INSTANCE() {
    return this.instance || (this.instance = new JSXManager());
  }

  register(name: string, component: AnyComponent<any, any>) {
    if (name in this.components) {
      throw new Error(`Component with same name is register.`);
    }
    this.components[name] = component;
    return this;
  }

  insert(query: string, component: JSX.Element, isReplaced = false) {
    const nodes = document.querySelectorAll(query);
    Array.from(nodes).forEach((node: Element) =>
      render(component, node, isReplaced ? node.firstElementChild : null)
    );
    return this;
  }

  remove(query: string) {
    const nodes = document.querySelectorAll(query);
    Array.from(nodes).forEach((node: Element) => node.innerHTML = '');
  }

  create(name: string, props = {}, children: JSX.Element | JSX.Element[] = []) {
    return h(this.components[name] || name, props, children);
  }

}
