export interface DialogApi<DialogProps = {}> {
  custom(dialogProps: DialogProps);
  confirm(dialogProps: DialogProps);
  alert(dialogProps: DialogProps);
}
