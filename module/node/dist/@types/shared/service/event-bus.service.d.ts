import { createEventBus, getEventBus, setEventBusDevTool, EventBus, EventBusConfig, EventBusDevTool } from '@sardonyxwt/event-bus';
export interface EventBusService {
    createEventBus(config?: EventBusConfig): EventBus;
    getEventBus(scopeName: string): EventBus;
    setEventBusDevTool(devTool: Partial<EventBusDevTool>): void;
}
export declare class EventBusServiceImpl implements EventBusService {
    createEventBus: typeof createEventBus;
    getEventBus: typeof getEventBus;
    setEventBusDevTool: typeof setEventBusDevTool;
}
