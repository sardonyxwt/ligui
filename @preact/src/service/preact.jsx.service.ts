import { h, render } from 'preact';
import { JSXService } from '@core';

class JsxServiceImpl extends JSXService {

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

}

export const preactJsxService: JSXService = new JsxServiceImpl();
