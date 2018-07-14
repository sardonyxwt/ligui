export interface DialogApi<DialogProps = {}> {
    custom(dialogProps: DialogProps): any;
    confirm(dialogProps: DialogProps): any;
    alert(dialogProps: DialogProps): any;
}
