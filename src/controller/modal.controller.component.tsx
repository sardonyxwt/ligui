import * as React from 'react';
import { createUniqueIdGenerator } from '@source/util/generator.util';

/**
 * @description You can use context in modals to control modals from himself.
 */
export const ModalContext = React.createContext<{
    id: string;
    isOpen: boolean;
}>(null);

export type ModalControllerProps = {
    modalAnimationTime?: number;
};

type ModalControllerState = {
    modals: Record<
        string,
        {
            isOpen: boolean;
            modal: React.ReactNode;
        }
    >;
};

export interface ModalController {
    open(modal: React.ReactNode): string;
    close(modalId: string): void;
}

// TODO test in projects and updates later.
/**
 * @class ModalControllerImpl
 * @description Modal controller to controls modals in application.
 * Mount component in any place in project.
 * To control child styles and position use outer wrapper.
 * */
export class ModalControllerImpl
    extends React.Component<ModalControllerProps, ModalControllerState>
    implements ModalController {
    public static instance: ModalController;
    public static defaultProps: ModalControllerProps = {
        modalAnimationTime: 300,
    };
    private idGenerator = createUniqueIdGenerator('ModalId');

    constructor(props: ModalControllerProps) {
        super(props);
        ModalControllerImpl.instance = this;
        this.state = {
            modals: {},
        };
    }

    public open(modal: React.ReactNode): string {
        const { modals } = this.state;
        const modalId = this.idGenerator();
        modals[modalId] = { modal, isOpen: false };
        this.setState({ modals });
        requestAnimationFrame(() => {
            modals[modalId] = { modal, isOpen: true };
            this.setState({ modals });
        });
        return modalId;
    }

    public close(modalId: string): void {
        const { modals } = this.state;
        const { modal } = modals[modalId];
        modals[modalId] = { modal, isOpen: false };
        this.setState({ modals });
        setTimeout(() => {
            delete modals[modalId];
            this.setState({ modals });
        }, this.props.modalAnimationTime);
    }

    render(): React.ReactNode {
        const { modals } = this.state;
        return Object.keys(modals).map((id) => {
            const { modal, isOpen } = modals[id];
            return (
                <ModalContext.Provider key={id} value={{ id, isOpen }}>
                    {modal}
                </ModalContext.Provider>
            );
        });
    }
}
