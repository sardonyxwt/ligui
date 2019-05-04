import { injectable } from 'inversify';
import {
  createStore, getStore, getState, setStoreDevTool,
  Store, StoreConfig, StoreDevTool
} from '@sardonyxwt/state-store';

export interface StoreService {
  createStore(config: StoreConfig): Store;
  getStore(storeName: string): Store;
  getState(): {};
  setStoreDevTool(devTool: Partial<StoreDevTool>): void;
}

@injectable()
export class StoreServiceImpl implements StoreService {
  createStore = createStore;
  getState = getState;
  getStore = getStore;
  setStoreDevTool = setStoreDevTool;
}
