export interface NotificationApi<NotificationProps = {}> {
    show(props: NotificationProps): string;
    hide(key: string, callback?: () => void): any;
}
