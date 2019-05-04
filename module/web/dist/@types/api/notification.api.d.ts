export interface NotificationApi<NotificationProps = {}> {
    show(props: NotificationProps): string;
    hide(key: string): void;
    hideLast(): void;
}
