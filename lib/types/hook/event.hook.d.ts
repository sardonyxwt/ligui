import { EventBus, EventBusListener } from '@sardonyxwt/event-bus';
export declare const createEventHook: (eventBus: EventBus) => <T = unknown>(eventNames: string[], listener: EventBusListener) => void;
