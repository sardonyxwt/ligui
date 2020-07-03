export interface Repository<T = unknown> {
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
    collect(): Record<string, unknown>;
    restore(restoredStates: Record<string, unknown>): void;
    reset(): void;
    registerRepository<T>(id: string, repository: Repository<T>, config?: RepositoryConfig): void;
}
export declare class RepositoryServiceImpl implements RepositoryService {
    private readonly _states;
    private readonly _repositories;
    get<T>(id: string): T;
    set<T>(id: string, state: T): void;
    delete(id: string): void;
    collect(): Record<string, unknown>;
    reset(): void;
    restore(restoredStates: Record<string, unknown>): void;
    registerRepository(id: string, repository: Repository, config?: RepositoryConfig): void;
}
