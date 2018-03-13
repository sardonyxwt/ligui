import { render } from 'react-dom';
import { createElement } from 'react';
import { JSXService } from '@core';

class JsxServiceImpl extends JSXService {

  render(query: string, component, isReplaced = false) {
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

export const reactJsxService: JSXService = new JsxServiceImpl();
