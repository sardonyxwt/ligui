import { EventBus, EventBusConfig, EventBusDevTool } from '@sardonyxwt/event-bus';
export interface EventBusService {
    createEventBus(config?: EventBusConfig): EventBus;
    getEventBus(scopeName: string): EventBus;
    setEventBusDevTool(devTool: Partial<EventBusDevTool>): void;
}
export declare const eventBusService: EventBusService;
