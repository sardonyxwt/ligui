import { Scope, ScopeListener, ScopeListenerUnsubscribeCallback, ScopeMacroType, Store } from '@sardonyxwt/state-store';
import { copyArray, saveToArray } from '@sardonyxwt/utils/object';

export const CONFIG_SCOPE_NAME = 'config';
export const CONFIG_SCOPE_SET_CONFIG_UNIT_ACTION = 'setConfigUnit';

export interface ConfigUnitId {
    readonly key: string;
    readonly context?: string;
}

export interface ConfigUnitData {
    readonly [key: string]: string | number | boolean | ConfigUnitData | ConfigUnitData[];
}

export interface ConfigUnit {
    readonly id: ConfigUnitId;
    readonly data: ConfigUnitData;
}

export interface ConfigScopeState {
    readonly configUnits: ConfigUnit[];
}

export interface ConfigScopeExtensions extends ConfigScopeState {
    setConfigUnit(configUnit: ConfigUnit): void;

    getConfigUnitData(id: ConfigUnitId): ConfigUnitData;

    isConfigUnitLoaded(id: ConfigUnitId): boolean;

    onSetConfigUnit(listener: ScopeListener<ConfigScopeState>): ScopeListenerUnsubscribeCallback;
}

export interface ConfigScope extends Scope<ConfigScopeState>,
    ConfigScopeExtensions {
}

export const configUnitIdComparator = (id1: ConfigUnitId, id2: ConfigUnitId) =>
    id1.key === id2.key && id1.context === id2.context;

const defaultConfigScopeInitState: ConfigScopeState = {
    configUnits: []
};

export function createConfigScope(store: Store, initState = defaultConfigScopeInitState) {
    const configScope = store.createScope<ConfigScopeState>({
        name: CONFIG_SCOPE_NAME,
        initState,
        isSubscribedMacroAutoCreateEnabled: true
    }) as ConfigScope;

    configScope.registerAction(CONFIG_SCOPE_SET_CONFIG_UNIT_ACTION, (
        state,
        configUnit: ConfigUnit
    ) => {
        const configUnits = copyArray(state.configUnits);
        saveToArray(configUnits, configUnit, it => configUnitIdComparator(configUnit.id, it.id));

        return {...state, configUnits};
    });

    configScope.registerMacro('configUnits', state => state.configUnits, ScopeMacroType.GETTER);
    configScope.registerMacro('getConfigUnitData', (state, id: ConfigUnitId): ConfigUnitData => {
        const configUnit = state.configUnits.find(it => configUnitIdComparator(id, it.id));
        return !!configUnit ? configUnit.data : undefined;
    });
    configScope.registerMacro('isConfigUnitLoaded', (state, id: ConfigUnitId): boolean => {
        return typeof configScope.getConfigUnitData(id) !== 'undefined';
    });

    configScope.lock();

    return configScope;
}
