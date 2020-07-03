import * as React from 'react';
import { EventBus, EventBusListener } from '@sardonyxwt/event-bus';

export const createEventHook = (eventBus: EventBus) => <T = unknown>(
    eventNames: string[] = null,
    listener: EventBusListener,
): void => {
    React.useEffect(() => {
        return eventBus.subscribe(listener, eventNames);
    }, []);
};
