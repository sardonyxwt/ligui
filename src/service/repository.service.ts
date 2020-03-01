export interface Repository<T = any> {
    collect?(): T;
    restore?(state: T): void;
    reset?(): void;
}

export interface RepositoryService {
    get<T>(id: string): T;
    set<T>(id: string, state: T);
    delete(id: string): void;
    collect(): Map<string, any>;
    restore(states: Map<string, any>): void;
    reset(): void;
    subscribe<T>(id: string, subscriber: Repository<T>): void;
}

export class RepositoryServiceImpl implements RepositoryService {

    private readonly _states = new Map<string, any>();
    private readonly _repository = new Map<string, Repository>();

    get<T>(id: string): T {
        return this._states.get(id);
    }

    set<T>(id: string, state: T) {
        this._states.set(id, state);
    }

    delete(id: string): void {
        this._states.delete(id);
    }

    collect(): Map<string, any> {
        const result = new Map<string, any>();
        this._repository.forEach((subscriber, id) => {
            const state = subscriber?.collect();
            if (state) {
                result.set(id, state);
            }
        });
        return result;
    }

    reset(): void {
        this._repository.forEach(subscriber => subscriber?.reset())
    }

    restore(states: Map<string, any>): void {
        states.forEach((state, id) => {
            if (this._repository.has(id)) {
                this._repository.get(id)?.restore(state);
            }
        });
    }

    subscribe(id: string, subscriber: Repository): void {
        this._repository.set(id, subscriber);
    }

}
