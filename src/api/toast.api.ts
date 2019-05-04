export interface ToastApi<ToastProps = {}> {
  info(message: string, duration?: number, onClose?: () => void): string;
  error(message: string, duration?: number, onClose?: () => void): string;
  success(message: string, duration?: number, onClose?: () => void): string;
  warning(message: string, duration?: number, onClose?: () => void): string;
  show(props: ToastProps): string;
  hide(key: string): void;
  hideLast(): void;
}
