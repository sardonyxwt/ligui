export interface ContextmenuApi<ContextmenuProps = {}> {
    show(evt: MouseEvent, props: ContextmenuProps): void;
    hide(): void;
}
