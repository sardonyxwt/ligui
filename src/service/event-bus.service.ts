import { injectable } from 'inversify';
import {
  createEventBus, getEventBus, setEventBusDevTool,
  EventBus, EventBusConfig, EventBusDevTool
} from '@sardonyxwt/event-bus';
import autobind from 'autobind-decorator';

export interface EventBusService {
  createEventBus(config?: EventBusConfig): EventBus;
  getEventBus(scopeName: string): EventBus;
  setEventBusDevTool(devTool: Partial<EventBusDevTool>): void;
}

@injectable()
@autobind
export class EventBusServiceImpl implements EventBusService {
  createEventBus = createEventBus;
  getEventBus = getEventBus;
  setEventBusDevTool = setEventBusDevTool;
}
