export interface ContextmenuApi<ContextmenuProps = {}> {
  show(evt: MouseEvent, props: ContextmenuProps);
  hide();
}
