export interface Repository<T = any> {
    collect?(): T;
    restore?(state: T): void;
    reset?(): void;
}
export interface RepositoryService {
    get<T>(id: string): T;
    set<T>(id: string, state: T): any;
    delete(id: string): void;
    collect(): {
        [id: string]: any;
    };
    restore(restoredStates: {
        [id: string]: any;
    }): void;
    reset(): void;
    subscribe<T>(id: string, subscriber: Repository<T>): void;
}
export declare class RepositoryServiceImpl implements RepositoryService {
    private readonly _states;
    private readonly _repository;
    get<T>(id: string): T;
    set<T>(id: string, state: T): void;
    delete(id: string): void;
    collect(): {
        [id: string]: any;
    };
    reset(): void;
    restore(restoredStates: {
        [id: string]: any;
    }): void;
    subscribe(id: string, subscriber: Repository): void;
}
//# sourceMappingURL=repository.service.d.ts.map