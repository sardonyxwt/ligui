import * as React from 'react';
import { EventBus, EventBusListener } from '@sardonyxwt/event-bus';

export const createEventHook = (
    eventBus: EventBus
) => <T = any>(
    eventNames: string[] = null,
    listener: EventBusListener
) => {
    React.useEffect(() => {
        return eventBus.subscribe(listener, eventNames)
    }, []);
};
