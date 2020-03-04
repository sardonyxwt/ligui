export interface Repository<T = any> {
    collect?(): T;
    restore?(state: T): void;
    reset?(): void;
}
export interface RepositoryConfig {
    activeCollect?: boolean;
    activeRestore?: boolean;
    activeReset?: boolean;
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
    registerRepository<T>(id: string, repository: Repository<T>, config?: RepositoryConfig): void;
}
export declare class RepositoryServiceImpl implements RepositoryService {
    private readonly _states;
    private readonly _repositories;
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
    registerRepository(id: string, repository: Repository, config?: RepositoryConfig): void;
}
//# sourceMappingURL=repository.service.d.ts.map