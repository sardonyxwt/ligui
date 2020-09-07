import * as React from 'react';
import { createUniqueIdGenerator } from '@source/util/generator.util';

/**
 * @description You can use context in toasts to control toasts from himself.
 */
export const ToastContext = React.createContext<{
    id: string;
    isOpen: boolean;
}>(null);

export type ToastControllerProps = {
    toastAnimationTime?: number;
};

type ToastControllerState = {
    toasts: Record<
        string,
        {
            isOpen: boolean;
            toast: React.ReactNode;
        }
    >;
};

export interface ToastController {
    open(toast: React.ReactNode): string;
    close(toastId: string): void;
}

// TODO test in projects and updates later.
/**
 * @class ToastControllerImpl
 * @description Toast controller to controls toasts in application.
 * Mount component in any place in project.
 * To control child styles and position use outer wrapper.
 * */
export class ToastControllerImpl
    extends React.Component<ToastControllerProps, ToastControllerState>
    implements ToastController {
    public static instance: ToastController;
    public static defaultProps: ToastControllerProps = {
        toastAnimationTime: 300,
    };
    private idGenerator = createUniqueIdGenerator('ToastId');

    constructor(props: ToastControllerProps) {
        super(props);
        ToastControllerImpl.instance = this;
        this.state = {
            toasts: {},
        };
    }

    public open(toast: React.ReactNode): string {
        const { toasts } = this.state;
        const toastId = this.idGenerator();
        toasts[toastId] = { toast, isOpen: false };
        this.setState({ toasts });
        requestAnimationFrame(() => {
            toasts[toastId] = { toast, isOpen: true };
            this.setState({ toasts });
        });
        return toastId;
    }

    public close(toastId: string): void {
        const { toasts } = this.state;
        const { toast } = toasts[toastId];
        toasts[toastId] = { toast, isOpen: false };
        this.setState({ toasts });
        setTimeout(() => {
            delete toasts[toastId];
            this.setState({ toasts });
        }, this.props.toastAnimationTime);
    }

    render(): React.ReactNode {
        const { toasts } = this.state;
        return Object.keys(toasts).map((id) => {
            const { toast, isOpen } = toasts[id];
            return (
                <ToastContext.Provider key={id} value={{ id, isOpen }}>
                    {toast}
                </ToastContext.Provider>
            );
        });
    }
}
