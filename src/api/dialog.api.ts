export interface DialogApi<DialogProps = {}> {
  show(dialogProps: DialogProps): string;
  hide(id: string)
}
