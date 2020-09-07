import * as React from 'react';
import { EventBusListener } from '@sardonyxwt/event-bus';
import { Core } from '@source/core';

/**
 * @type EventHook
 * @description React hook to subscribe event bus
 * @param listener {EventBusListener} Events listener.
 * @param eventNames {string[]} Array of events for subscription.
 */
export type EventHook = (
    listener: EventBusListener,
    eventNames?: string[],
) => void;

/**
 * @function createEventHook
 * @param coreGlobalRegisterName {string} Core instance global name.
 * @returns React hook to subscribe to event bus.
 */
export const createEventHook = (coreGlobalRegisterName: string): EventHook => {
    return (listener: EventBusListener, eventNames: string[] = null): void => {
        const core = global[coreGlobalRegisterName] as Core;

        React.useEffect(() => core.eventBus.subscribe(listener, eventNames), [
            eventNames?.join(','),
        ]);
    };
};
