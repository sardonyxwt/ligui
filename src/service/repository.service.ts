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
    set<T>(id: string, state: T);
    delete(id: string): void;
    collect(): Record<string, unknown>;
    restore(restoredStates: Record<string, unknown>): void;
    reset(): void;
    registerRepository<T>(
        id: string,
        repository: Repository<T>,
        config?: RepositoryConfig,
    ): void;
}

export class RepositoryServiceImpl implements RepositoryService {
    private readonly _states = new Map<string, unknown>();
    private readonly _repositories = new Map<string, Repository>();

    get<T>(id: string): T {
        return this._states.get(id) as T;
    }

    set<T>(id: string, state: T): void {
        this._states.set(id, state);
    }

    delete(id: string): void {
        this._states.delete(id);
    }

    collect(): Record<string, unknown> {
        const result = {};
        this._repositories.forEach((repository, id) => {
            const state = repository.collect?.();
            if (state) {
                result[id] = state;
            }
        });
        return result;
    }

    reset(): void {
        this._repositories.forEach((repository) => repository.reset?.());
    }

    restore(restoredStates: Record<string, unknown>): void {
        Object.getOwnPropertyNames(restoredStates).forEach((id) => {
            const restoredState = restoredStates[id];
            this._repositories.has(id)
                ? this._repositories.get(id).restore?.(restoredState)
                : this._states.set(id, restoredState);
        });
    }

    registerRepository(
        id: string,
        repository: Repository,
        config: RepositoryConfig = {},
    ): void {
        const {
            activeCollect = true,
            activeRestore = true,
            activeReset = true,
        } = config;
        const repositoryProxy: Repository = {};
        if (activeCollect) {
            repositoryProxy.collect = () => repository.collect?.();
        }
        if (activeRestore) {
            repositoryProxy.restore = (state) => repository.restore?.(state);
        }
        if (activeReset) {
            repositoryProxy.reset = () => repository.reset?.();
        }
        this._repositories.set(id, repositoryProxy);
        if (this._states.has(id)) {
            repositoryProxy.restore?.(this._states.get(id));
        }
    }
}
