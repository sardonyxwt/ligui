import { ScopeListener, ScopeListenerUnsubscribeCallback } from '@sardonyxwt/state-store';
import {
    ConfigScope,
    ConfigScopeExtensions,
    ConfigScopeState,
    ConfigUnit,
    ConfigUnitData,
    ConfigUnitId,
    configUnitIdComparator
} from '../scope/config.scope';
import { deleteFromArray, saveToArray } from '@sardonyxwt/utils/object';

export interface ConfigUnitDataLoader {
    readonly context?: string;
    readonly loader: (key: string) => Promise<ConfigUnitData>;
}

export interface ConfigUnitDataPromise {
    readonly id: ConfigUnitId
    readonly promise: Promise<any>;
}

export interface ConfigService extends ConfigScopeExtensions {
    registerConfigUnitDataLoader<T>(loader: ConfigUnitDataLoader): void;

    loadConfigUnitData(id: ConfigUnitId): Promise<ConfigUnitData>;
}

export class ConfigServiceImpl implements ConfigService {

    private _configUnitPromises: ConfigUnitDataPromise[] = [];

    constructor(protected _scope: ConfigScope,
                protected _configUnitLoaders: ConfigUnitDataLoader[] = []) {
    }

    get configUnits() {
        return this._scope.configUnits;
    };

    registerConfigUnitDataLoader<T>(loader: ConfigUnitDataLoader) {
        deleteFromArray(this._configUnitPromises, modulePromise => modulePromise.id.context === loader.context);
        saveToArray(this._configUnitLoaders, loader, moduleLoader => moduleLoader.context === loader.context);
    }

    setConfigUnit(configUnit: ConfigUnit): void {
        this._scope.setConfigUnit(configUnit);
    }

    getConfigUnitData(id: ConfigUnitId): ConfigUnitData {
        return this._scope.getConfigUnitData(id);
    }

    onSetConfigUnit(listener: ScopeListener<ConfigScopeState>): ScopeListenerUnsubscribeCallback {
        return this._scope.onSetConfigUnit(listener);
    }

    isConfigUnitLoaded(id: ConfigUnitId): boolean {
        return this._scope.isConfigUnitLoaded(id);
    }

    loadConfigUnitData(id: ConfigUnitId): Promise<ConfigUnitData> {
        const {_configUnitPromises, _configUnitLoaders, _scope} = this;
        const {setConfigUnit, getConfigUnitData} = _scope;

        const configUnitPromise = _configUnitPromises.find(it => configUnitIdComparator(id, it.id));

        if (configUnitPromise) {
            return configUnitPromise.promise;
        }

        const configUnitData = getConfigUnitData(id);

        if (configUnitData) {
            const newConfigUnitDataPromise: ConfigUnitDataPromise = {
                id, promise: Promise.resolve(configUnitData)
            };
            _configUnitPromises.push(newConfigUnitDataPromise);
            return newConfigUnitDataPromise.promise;
        }

        const configUnitLoader = _configUnitLoaders.find(it => it.context === id.context);

        if (!configUnitLoader) {
            throw new Error(`ConfigUnitData loader for key ${JSON.stringify(id)} not found`);
        }

        const newConfigUnitDataPromise: ConfigUnitDataPromise = {
            id, promise: configUnitLoader.loader(id.key)
                .then(configUnitData => {
                    setConfigUnit({id, data: configUnitData});
                    return configUnitData;
                })
        };

        _configUnitPromises.push(newConfigUnitDataPromise);

        return newConfigUnitDataPromise.promise;
    }

}
