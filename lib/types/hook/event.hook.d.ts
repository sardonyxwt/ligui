import { EventBus, EventBusListener } from '@sardonyxwt/event-bus';
export declare const createEventHook: (eventBus: EventBus) => <T = any>(eventNames: string[], listener: EventBusListener) => void;
