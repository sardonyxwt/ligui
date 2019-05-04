import { createStore, getStore, getState, setStoreDevTool, Store, StoreConfig, StoreDevTool } from '@sardonyxwt/state-store';
export interface StoreService {
    createStore(config: StoreConfig): Store;
    getStore(storeName: string): Store;
    getState(): {};
    setStoreDevTool(devTool: Partial<StoreDevTool>): void;
}
export declare class StoreServiceImpl implements StoreService {
    createStore: typeof createStore;
    getState: typeof getState;
    getStore: typeof getStore;
    setStoreDevTool: typeof setStoreDevTool;
}
