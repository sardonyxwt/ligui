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
    set<T>(id: string, state: T);
    delete(id: string): void;
    collect(): {[id: string]: any};
    restore(restoredStates: {[id: string]: any}): void;
    reset(): void;
    registerRepository<T>(id: string, repository: Repository<T>, config?: RepositoryConfig): void;
}

export class RepositoryServiceImpl implements RepositoryService {

    private readonly _states = new Map<string, any>();
    private readonly _repositories = new Map<string, Repository>();

    get<T>(id: string): T {
        return this._states.get(id);
    }

    set<T>(id: string, state: T) {
        this._states.set(id, state);
    }

    delete(id: string): void {
        this._states.delete(id);
    }

    collect(): {[id: string]: any} {
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
        this._repositories.forEach(repository => repository.reset?.())
    }

    restore(restoredStates: {[id: string]: any}): void {
        Object.getOwnPropertyNames(restoredStates).forEach(id => {
            const restoredState = restoredStates[id];
            this._repositories.has(id)
                ? this._repositories.get(id).restore?.(restoredState)
                : this._states.set(id, restoredState);
        });
    }

    registerRepository(id: string, repository: Repository, config: RepositoryConfig = {}): void {
        const {
            activeCollect = true,
            activeRestore = true,
            activeReset = true
        } = config;
        const repositoryProxy: Repository = {};
        if (activeCollect) {
            repositoryProxy.collect = () => repository.collect();
        }
        if (activeRestore) {
            repositoryProxy.restore = (state) => repository.restore(state);
        }
        if (activeReset) {
            repositoryProxy.reset = () => repository.reset();
        }
        this._repositories.set(id, repositoryProxy);
        if (this._states.has(id)) {
            repositoryProxy.restore?.(this._states.get(id));
        }
    }

}
