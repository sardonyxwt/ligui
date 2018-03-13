export abstract class JSXService {

  protected components = {};

  register(name: string, component) {
    if (name in this.components) {
      throw new Error(`Component with same name is register.`);
    }
    this.components[name] = component;
    return this;
  }

  remove(query: string) {
    const nodes = document.querySelectorAll(query);
    for (let i = 0; i < nodes.length; i++) {
      let node = nodes.item(i);
      node.innerHTML = '';
    }
  }

  abstract render(query: string, component, isReplaced?: boolean): JSXService;
  abstract create(name: string, props?: {}, children?: JSX.Element | JSX.Element[]);

}
