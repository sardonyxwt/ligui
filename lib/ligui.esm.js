import Container from 'bottlejs';
export { default as Container } from 'bottlejs';
import { isStoreExist, createStore, RESET_SCOPE_ACTION, RESTORE_SCOPE_ACTION, getState, getStore, setStoreDevTool } from '@sardonyxwt/state-store';
export * from '@sardonyxwt/state-store';
import { isEventBusExist, createEventBus, getEventBus, setEventBusDevTool } from '@sardonyxwt/event-bus';
export * from '@sardonyxwt/event-bus';
import { copyArray, saveToArray, deleteFromArray, createUniqueIdGenerator } from '@sardonyxwt/utils';
import * as React from 'react';
import { createElement, useState, useEffect, useMemo, useRef as useRef$1, createContext as createContext$1, useContext } from 'react';
import { hydrate, render } from 'react-dom';

const LIGUI_TYPES = {
    STORE: '$store',
    EVENT_BUS: '$eventBus',
    MODULE_STORE: '$moduleStore',
    RESOURCE_STORE: '$resourceStore',
    INTERNATIONALIZATION_STORE: '$internationalizationStore',
    CONFIG_STORE: '$configStore',
    MODULE_SERVICE: '$moduleService',
    RESOURCE_SERVICE: '$resourceService',
    INTERNATIONALIZATION_SERVICE: '$internationalizationService',
    CONFIG_SERVICE: '$configService',
    JSX_SERVICE: '$jsxService',
    REPOSITORY_SERVICE: '$repositoryService'
};

function createContext(name, bottle = new Container(name)) {
    if (isStoreExist(name)) {
        throw new Error(`Ligui store exist with name ${name}`);
    }
    if (isEventBusExist(name)) {
        throw new Error(`Ligui event bus exist with name ${name}`);
    }
    return Object.freeze({
        store: createStore({ name }),
        eventBus: createEventBus({ name }),
        bottle: bottle
    });
}

var ModuleStoreActions;
(function (ModuleStoreActions) {
    ModuleStoreActions["UpdateModules"] = "UPDATE_MODULES";
})(ModuleStoreActions || (ModuleStoreActions = {}));
const createModuleStore = (store, initState) => {
    const moduleStore = store.createScope({
        name: LIGUI_TYPES.MODULE_STORE,
        initState: {
            modules: initState.modules || []
        },
        isSubscribedMacroAutoCreateEnabled: true,
    }, true);
    moduleStore.setModules = moduleStore.registerAction(ModuleStoreActions.UpdateModules, (state, modules) => {
        const updatedModules = copyArray(state.modules);
        modules.forEach(module => saveToArray(updatedModules, module, existModule => isModulesIdsEqual(module.id, existModule.id)));
        return {
            modules: updatedModules
        };
    });
    moduleStore.findModuleById = (id) => {
        return moduleStore.state.modules.find(module => isModulesIdsEqual(module.id, id));
    };
    moduleStore.isModuleExist = (id) => {
        return !!moduleStore.findModuleById(id);
    };
    return moduleStore;
};
function isModulesIdsEqual(moduleId1, moduleId2) {
    return moduleId1.key === moduleId2.key
        && moduleId1.context === moduleId2.context;
}

var ResourceStoreActions;
(function (ResourceStoreActions) {
    ResourceStoreActions["UpdateResources"] = "UPDATE_RESOURCES";
})(ResourceStoreActions || (ResourceStoreActions = {}));
const createResourceStore = (store, initState) => {
    const resourceStore = store.createScope({
        name: LIGUI_TYPES.RESOURCE_STORE,
        initState: {
            resources: initState.resources || []
        },
        isSubscribedMacroAutoCreateEnabled: true,
    }, true);
    resourceStore.registerAction(ResourceStoreActions.UpdateResources, (state, resources) => {
        const updatedResources = copyArray(state.resources);
        resources.forEach(resource => saveToArray(updatedResources, resource, existResource => isResourcesIdsEqual(resource.id, existResource.id)));
        return {
            resources: updatedResources
        };
    });
    resourceStore.findResourceById = (id) => {
        return resourceStore.state.resources.find(resource => isResourcesIdsEqual(resource.id, id));
    };
    resourceStore.isResourceExist = (id) => {
        return !!resourceStore.findResourceById(id);
    };
    return resourceStore;
};
function isResourcesIdsEqual(resourceId1, resourceId2) {
    return resourceId1.key === resourceId2.key
        && resourceId1.context === resourceId2.context;
}

var InternationalizationStoreActions;
(function (InternationalizationStoreActions) {
    InternationalizationStoreActions["ChangeLocale"] = "CHANGE_LOCALE";
    InternationalizationStoreActions["UpdateTranslateUnits"] = "UPDATE_TRANSLATE_UNITS";
})(InternationalizationStoreActions || (InternationalizationStoreActions = {}));
const createInternationalizationStore = (store, initState) => {
    const internationalizationStore = store.createScope({
        name: LIGUI_TYPES.INTERNATIONALIZATION_STORE,
        initState: {
            currentLocale: initState.currentLocale || null,
            defaultLocale: initState.defaultLocale || null,
            locales: initState.locales || [],
            translateUnits: initState.translateUnits || []
        },
        isSubscribedMacroAutoCreateEnabled: true,
    }, true);
    internationalizationStore.setLocale = internationalizationStore.registerAction(InternationalizationStoreActions.ChangeLocale, (state, locale) => {
        if (!internationalizationStore.isLocaleExist(locale)) {
            throw new Error('Locale not present in locales.');
        }
        return Object.assign(Object.assign({}, state), { currentLocale: locale });
    });
    internationalizationStore.setTranslateUnits = internationalizationStore.registerAction(InternationalizationStoreActions.UpdateTranslateUnits, (state, translateUnits) => {
        const updatedTranslateUnits = copyArray(state.translateUnits);
        translateUnits.forEach(translateUnit => saveToArray(updatedTranslateUnits, translateUnit, existTranslateUnit => isTranslateUnitsIdsEqual(translateUnit.id, existTranslateUnit.id)));
        return Object.assign(Object.assign({}, state), { translateUnits: updatedTranslateUnits });
    });
    internationalizationStore.setTranslationForLocale = (locale, translationObject, context) => {
        const translationUnits = Object.getOwnPropertyNames(translationObject).map(key => ({
            id: { key, locale, context },
            data: translationObject[key]
        }));
        internationalizationStore.setTranslateUnits(translationUnits);
    };
    internationalizationStore.getCurrentLocale = () => internationalizationStore.state.currentLocale;
    internationalizationStore.getDefaultLocale = () => internationalizationStore.state.defaultLocale;
    internationalizationStore.getLocales = () => internationalizationStore.state.locales;
    internationalizationStore.findTranslateUnitById = (id) => {
        return internationalizationStore.state.translateUnits.find(translateUnit => isTranslateUnitsIdsEqual(translateUnit.id, id));
    };
    internationalizationStore.isLocaleExist = (locale) => {
        return !!internationalizationStore.state.locales.find(it => it === locale);
    };
    internationalizationStore.isTranslateUnitExist = (id) => {
        return !!internationalizationStore.findTranslateUnitById(id);
    };
    return internationalizationStore;
};
function isTranslateUnitsIdsEqual(translateUnitId1, translateUnitId2) {
    return translateUnitId1.key === translateUnitId2.key
        && translateUnitId1.locale === translateUnitId2.locale
        && translateUnitId1.context === translateUnitId2.context;
}

var ConfigStoreActions;
(function (ConfigStoreActions) {
    ConfigStoreActions["UpdateConfigs"] = "CONFIGS_UPDATE";
})(ConfigStoreActions || (ConfigStoreActions = {}));
const createConfigStore = (store, initState) => {
    const configStore = store.createScope({
        name: LIGUI_TYPES.CONFIG_STORE,
        initState: {
            configs: initState.configs || []
        },
        isSubscribedMacroAutoCreateEnabled: true,
    }, true);
    configStore.setConfigs = configStore.registerAction(ConfigStoreActions.UpdateConfigs, (state, configs) => {
        const updatedConfigs = copyArray(state.configs);
        configs.forEach(config => saveToArray(updatedConfigs, config, existConfig => isConfigsIdsEqual(config.id, existConfig.id)));
        return {
            configs: updatedConfigs
        };
    });
    configStore.findConfigById = (id) => {
        return configStore.state.configs.find(config => isConfigsIdsEqual(config.id, id));
    };
    configStore.isConfigExist = (id) => {
        return !!configStore.findConfigById(id);
    };
    return configStore;
};
function isConfigsIdsEqual(configId1, configId2) {
    return configId1.key === configId2.key
        && configId1.context === configId2.context;
}

const classes = (...classes) => {
    const resultClasses = [];
    classes.filter(it => !!it).forEach(clazz => {
        if (typeof clazz === 'string') {
            resultClasses.push(clazz);
        }
        else {
            const [className, isUsed] = clazz;
            if (isUsed) {
                resultClasses.push(className);
            }
        }
    });
    return resultClasses.join(' ');
};
const styles = (...styles) => {
    const resultStyles = [];
    styles.filter(it => !!it).forEach(style => {
        if (Array.isArray(style)) {
            const [styleProperties, isUsed] = style;
            if (isUsed) {
                resultStyles.push(styleProperties);
            }
        }
        else {
            resultStyles.push(style);
        }
    });
    return resultStyles.reduce((prev, current) => Object.assign(prev, current));
};
const eventTrap = (evt, includeNative = true) => {
    evt.preventDefault();
    evt.stopPropagation();
    if (evt['nativeEvent'] && includeNative) {
        evt['nativeEvent'].preventDefault();
        evt['nativeEvent'].stopPropagation();
    }
};
const isModifiedEvent = (evt) => {
    return !!(evt.metaKey || evt.altKey || evt.ctrlKey || evt.shiftKey);
};
const mergeRefs = (...refs) => (ref) => {
    refs.filter(resolvedRef => !!resolvedRef).map(resolvedRef => {
        if (typeof resolvedRef === 'function') {
            resolvedRef(ref);
        }
        else {
            resolvedRef.current = ref;
        }
    });
};
class JSXServiceImpl {
    constructor() {
        this._factories = {};
        this.classes = classes;
        this.styles = styles;
        this.eventTrap = eventTrap;
        this.isModifiedEvent = isModifiedEvent;
        this.mergeRefs = mergeRefs;
    }
    hydrate(container, element) {
        hydrate(element, container);
    }
    hydrateComponent(container, name, props, ...children) {
        hydrate(this.node(name, props, children), container);
    }
    node(name, props, ...children) {
        if (name in this._factories) {
            return this._factories[name](props, children);
        }
        return createElement(name, props, children);
    }
    registerFactory(name, factory) {
        if (name in this._factories) {
            throw new Error(`Factory with same name is register.`);
        }
        this._factories[name] = factory;
    }
    render(container, element) {
        render(element, container);
    }
    renderComponent(container, name, props, ...children) {
        render(this.node(name, props, children), container);
    }
}

class ResourceServiceImpl {
    constructor(_store, _resourceLoaders = []) {
        this._store = _store;
        this._resourceLoaders = _resourceLoaders;
        this._resourcePromises = [];
    }
    setResourceLoader(loader) {
        deleteFromArray(this._resourcePromises, resourcePromise => resourcePromise.id.context === loader.context);
        saveToArray(this._resourceLoaders, loader, resourceLoader => resourceLoader.context === loader.context);
    }
    getResourceLoader(context) {
        return this._resourceLoaders.find(loader => loader.context === context);
    }
    loadResource(id) {
        const { _resourcePromises, _resourceLoaders, _store } = this;
        if (_store.isResourceExist(id)) {
            return _store.findResourceById(id);
        }
        const resourcePromise = _resourcePromises.find(it => isResourcesIdsEqual(id, it.id));
        if (resourcePromise) {
            return resourcePromise.promise;
        }
        const resourceLoader = _resourceLoaders.find(loader => loader.context === id.context);
        if (!resourceLoader) {
            throw new Error(`Resource loader for key ${JSON.stringify(id)} not found`);
        }
        const resourceData = resourceLoader.loader(id.key);
        const resolveResource = (resourceData) => {
            const resource = { id, data: resourceData };
            _store.setResources([resource]);
            return resource;
        };
        if (resourceData instanceof Promise) {
            const newResourcePromise = {
                id, promise: resourceData.then(resolveResource)
            };
            newResourcePromise.promise.then(() => deleteFromArray(this._resourcePromises, resourcePromise => isResourcesIdsEqual(resourcePromise.id, id)));
            _resourcePromises.push(newResourcePromise);
            return newResourcePromise.promise;
        }
        return resolveResource(resourceData);
    }
}

class InternationalizationServiceImpl {
    constructor(_store, _translateUnitLoaders = []) {
        this._store = _store;
        this._translateUnitLoaders = _translateUnitLoaders;
        this._translateUnitPromises = [];
    }
    setTranslateUnitLoader(loader) {
        deleteFromArray(this._translateUnitPromises, translateUnitPromise => translateUnitPromise.id.context === loader.context);
        saveToArray(this._translateUnitLoaders, loader, translateUnitLoader => translateUnitLoader.context === loader.context);
    }
    getTranslateUnitLoader(context) {
        return this._translateUnitLoaders.find(loader => loader.context === context);
    }
    loadTranslateUnit(id) {
        var _a;
        const { _translateUnitPromises, _translateUnitLoaders, _store } = this;
        if (_store.isTranslateUnitExist(id)) {
            return _store.findTranslateUnitById(id);
        }
        const translateUnitPromise = _translateUnitPromises.find(it => isTranslateUnitsIdsEqual(id, it.id));
        if (translateUnitPromise) {
            return translateUnitPromise.promise;
        }
        const translateUnitLoader = _translateUnitLoaders.find(loader => loader.context === id.context);
        if (!translateUnitLoader) {
            throw new Error(`TranslateUnit loader for key ${JSON.stringify(id)} not found`);
        }
        const translateUnitData = (_a = translateUnitLoader.loader(id.key, id.locale)) !== null && _a !== void 0 ? _a : translateUnitLoader.loader(id.key, _store.getDefaultLocale());
        const resolveTranslateUnit = (translateUnitData) => {
            const translateUnit = { id, data: translateUnitData };
            _store.setTranslateUnits([translateUnit]);
            return translateUnit;
        };
        if (translateUnitData instanceof Promise) {
            const newTranslateUnitPromise = {
                id, promise: translateUnitData.then(resolveTranslateUnit)
            };
            newTranslateUnitPromise.promise.then(() => deleteFromArray(this._translateUnitPromises, translateUnitPromise => isTranslateUnitsIdsEqual(translateUnitPromise.id, id)));
            _translateUnitPromises.push(newTranslateUnitPromise);
            return newTranslateUnitPromise.promise;
        }
        return resolveTranslateUnit(translateUnitData);
    }
    getTranslator(context, locale) {
        const translator = (path, argsOrDefaultValue) => {
            var _a;
            let resolvedArgs = {};
            if (typeof argsOrDefaultValue === 'string') {
                resolvedArgs = { defaultValue: argsOrDefaultValue };
            }
            else if (typeof argsOrDefaultValue === 'object') {
                resolvedArgs = argsOrDefaultValue;
            }
            if (typeof path === 'object') {
                return path[translator.locale] || resolvedArgs.defaultValue;
            }
            if (typeof path !== 'string') {
                throw new Error(`Invalid translator arg path format ${path}`);
            }
            const resolvedPath = `${translator.prefix}${path}`;
            const [key, ...pathParts] = resolvedPath.split(/[.\[\]]/).filter(it => it !== '');
            const translateUnitId = { key, context, locale: locale || this._store.getCurrentLocale() };
            const defaultTranslateUnitId = { key, context, locale: this._store.getDefaultLocale() };
            let translateUnit = (_a = this._store.findTranslateUnitById(translateUnitId)) !== null && _a !== void 0 ? _a : this._store.findTranslateUnitById(defaultTranslateUnitId);
            if (translateUnit === undefined) {
                return resolvedArgs.defaultValue;
            }
            let result = translateUnit.data;
            for (let i = 0; i < pathParts.length && !!result; i++) {
                result = result[pathParts[i]];
            }
            if (result === undefined) {
                return resolvedArgs.defaultValue;
            }
            if (typeof result !== 'string') {
                return result;
            }
            Object.keys(resolvedArgs).forEach(argKey => {
                result = result.replace(`\${${argKey}`, JSON.stringify(resolvedArgs[argKey]));
            });
            return result;
        };
        translator.locale = locale || this._store.getCurrentLocale();
        translator.prefix = '';
        return translator;
    }
}

class ConfigServiceImpl {
    constructor(_store, _configLoaders = []) {
        this._store = _store;
        this._configLoaders = _configLoaders;
        this._configPromises = [];
    }
    setConfigLoader(loader) {
        deleteFromArray(this._configPromises, configPromise => configPromise.id.context === loader.context);
        saveToArray(this._configLoaders, loader, configLoader => configLoader.context === loader.context);
    }
    getConfigLoader(context) {
        return this._configLoaders.find(loader => loader.context === context);
    }
    loadConfig(id) {
        const { _configPromises, _configLoaders, _store } = this;
        if (_store.isConfigExist(id)) {
            return _store.findConfigById(id);
        }
        const configPromise = _configPromises.find(it => isConfigsIdsEqual(id, it.id));
        if (configPromise) {
            return configPromise.promise;
        }
        const configLoader = _configLoaders.find(loader => loader.context === id.context);
        if (!configLoader) {
            throw new Error(`Config loader for key ${JSON.stringify(id)} not found`);
        }
        const configData = configLoader.loader(id.key);
        const resolveConfig = (configData) => {
            const config = { id, data: configData };
            _store.setConfigs([config]);
            return config;
        };
        if (configData instanceof Promise) {
            const newConfigPromise = {
                id, promise: configData.then(resolveConfig)
            };
            newConfigPromise.promise.then(() => deleteFromArray(this._configPromises, configPromise => isConfigsIdsEqual(configPromise.id, id)));
            _configPromises.push(newConfigPromise);
            return newConfigPromise.promise;
        }
        return resolveConfig(configData);
    }
}

class ModuleServiceImpl {
    constructor(_store, _moduleLoaders = []) {
        this._store = _store;
        this._moduleLoaders = _moduleLoaders;
        this._modulePromises = [];
    }
    setModuleLoader(loader) {
        deleteFromArray(this._modulePromises, modulePromise => modulePromise.id.context === loader.context);
        saveToArray(this._moduleLoaders, loader, moduleLoader => moduleLoader.context === loader.context);
    }
    getModuleLoader(context) {
        return this._moduleLoaders.find(loader => loader.context === context);
    }
    loadModule(id) {
        const { _modulePromises, _moduleLoaders, _store } = this;
        if (_store.isModuleExist(id)) {
            return _store.findModuleById(id);
        }
        const modulePromise = _modulePromises.find(it => isModulesIdsEqual(id, it.id));
        if (modulePromise) {
            return modulePromise.promise;
        }
        const moduleLoader = _moduleLoaders.find(loader => loader.context === id.context);
        if (!moduleLoader) {
            throw new Error(`Module loader for key ${JSON.stringify(id)} not found`);
        }
        const moduleBody = moduleLoader.loader(id.key);
        const resolveModule = (moduleBody) => {
            const module = { id, body: moduleBody };
            _store.setModules([module]);
            return module;
        };
        if (moduleBody instanceof Promise) {
            const newModulePromise = {
                id, promise: moduleBody.then(resolveModule)
            };
            newModulePromise.promise.then(() => deleteFromArray(this._modulePromises, modulePromise => isModulesIdsEqual(modulePromise.id, id)));
            _modulePromises.push(newModulePromise);
            return newModulePromise.promise;
        }
        return resolveModule(moduleBody);
    }
}

class RepositoryServiceImpl {
    constructor() {
        this._states = new Map();
        this._repositories = new Map();
    }
    get(id) {
        return this._states.get(id);
    }
    set(id, state) {
        this._states.set(id, state);
    }
    delete(id) {
        this._states.delete(id);
    }
    collect() {
        const result = {};
        this._repositories.forEach((repository, id) => {
            var _a;
            const state = (_a = repository.collect) === null || _a === void 0 ? void 0 : _a.call(repository);
            if (state) {
                result[id] = state;
            }
        });
        return result;
    }
    reset() {
        this._repositories.forEach(repository => { var _a; return (_a = repository.reset) === null || _a === void 0 ? void 0 : _a.call(repository); });
    }
    restore(restoredStates) {
        Object.getOwnPropertyNames(restoredStates).forEach(id => {
            var _a, _b;
            const restoredState = restoredStates[id];
            this._repositories.has(id)
                ? (_b = (_a = this._repositories.get(id)).restore) === null || _b === void 0 ? void 0 : _b.call(_a, restoredState) : this._states.set(id, restoredState);
        });
    }
    registerRepository(id, repository, config = {}) {
        var _a;
        const { activeCollect = true, activeRestore = true, activeReset = true } = config;
        const repositoryProxy = {};
        if (activeCollect) {
            repositoryProxy.collect = () => { var _a; return (_a = repository.collect) === null || _a === void 0 ? void 0 : _a.call(repository); };
        }
        if (activeRestore) {
            repositoryProxy.restore = (state) => { var _a; return (_a = repository.restore) === null || _a === void 0 ? void 0 : _a.call(repository, state); };
        }
        if (activeReset) {
            repositoryProxy.reset = () => { var _a; return (_a = repository.reset) === null || _a === void 0 ? void 0 : _a.call(repository); };
        }
        this._repositories.set(id, repositoryProxy);
        if (this._states.has(id)) {
            (_a = repositoryProxy.restore) === null || _a === void 0 ? void 0 : _a.call(repositoryProxy, this._states.get(id));
        }
    }
}

const useData = (dataResolver, dataLoader, dataSync) => {
    const [data, setData] = useState(dataResolver);
    useEffect(() => {
        if (!data && dataLoader) {
            Promise.resolve(dataLoader()).then(data => setData(() => data));
        }
    }, []);
    useEffect(() => {
        if (dataSync) {
            const unsubscribeCallback = dataSync(() => setData(() => dataResolver()));
            if (typeof unsubscribeCallback === 'function') {
                return unsubscribeCallback;
            }
        }
    }, []);
    return data;
};

const idHookListenerIdGenerator = createUniqueIdGenerator('IdHook');
const useId = () => useMemo(() => idHookListenerIdGenerator(), []);

const useRef = (initialValue) => {
    const [current, setCurrent] = useState(initialValue);
    return ({
        set current(el) {
            setCurrent(() => el);
        },
        get current() {
            return current;
        }
    });
};

const createStateHook = (store) => (scope, actions, mapper, optimizer) => {
    const resolvedScope = typeof scope === 'string' ? store.getScope(scope) : scope;
    const resolvedMapper = mapper !== null && mapper !== void 0 ? mapper : ((state) => state);
    const stateRef = useRef$1(null);
    const [state, setState] = useState(() => resolvedMapper(resolvedScope.state));
    stateRef.current = state;
    useEffect(() => {
        return resolvedScope.subscribe(evt => {
            const newState = resolvedMapper(evt.newState);
            if (optimizer && !optimizer(stateRef.current, newState)) {
                return;
            }
            stateRef.current = newState;
            setState(() => newState);
        }, actions);
    }, []);
    return state;
};

const createEventHook = (eventBus) => (eventNames = null, listener) => {
    useEffect(() => {
        return eventBus.subscribe(listener, eventNames);
    }, []);
};

let ModuleKeyContext = null;
if (!!React) {
    ModuleKeyContext = createContext$1(undefined);
}
const createModuleHook = (container) => (key, context) => {
    const moduleStore = container[LIGUI_TYPES.MODULE_STORE];
    const moduleService = container[LIGUI_TYPES.MODULE_SERVICE];
    const moduleContext = context || useContext(ModuleKeyContext);
    const id = { key, context: moduleContext };
    const prepareModuleBody = () => {
        if (moduleStore.isModuleExist(id)) {
            return moduleStore.findModuleById(id).body;
        }
        const module = moduleService.loadModule(id);
        return module instanceof Promise ? null : module.body;
    };
    const [module, setModule] = useState(prepareModuleBody);
    useEffect(() => {
        if (module) {
            return;
        }
        Promise.resolve(moduleService.loadModule(id)).then(module => setModule(() => module.body));
    }, [module]);
    return module;
};

let ResourceKeyContext = null;
if (!!React) {
    ResourceKeyContext = createContext$1(undefined);
}
const createResourceHook = (container) => (key, context) => {
    const resourceStore = container[LIGUI_TYPES.RESOURCE_STORE];
    const resourceService = container[LIGUI_TYPES.RESOURCE_SERVICE];
    const resourceContext = context || useContext(ResourceKeyContext);
    const id = { key, context: resourceContext };
    const prepareResourceData = () => {
        if (resourceStore.isResourceExist(id)) {
            return resourceStore.findResourceById(id).data;
        }
        const resource = resourceService.loadResource(id);
        return resource instanceof Promise ? null : resource.data;
    };
    const [resource, setResource] = useState(prepareResourceData);
    useEffect(() => {
        if (resource) {
            return;
        }
        Promise.resolve(resourceService.loadResource(id)).then(resource => setResource(() => resource.data));
    }, [resource]);
    return resource;
};

const createDependencyHook = (container) => (id) => useMemo(() => {
    return container[id];
}, [id]);

let InternationalizationKeyContext = null;
if (!!React) {
    InternationalizationKeyContext = createContext$1(undefined);
}
const createI18nHook = (container) => () => {
    const internationalizationStore = container[LIGUI_TYPES.INTERNATIONALIZATION_STORE];
    const prepareI18nState = () => ({
        setLocale: (locale) => internationalizationStore.setLocale(locale),
        currentLocale: internationalizationStore.getCurrentLocale(),
        defaultLocale: internationalizationStore.getDefaultLocale(),
        locales: internationalizationStore.getLocales()
    });
    const [i18nState, setI18nState] = useState(prepareI18nState);
    useEffect(() => {
        return internationalizationStore.subscribe(() => {
            setI18nState(prepareI18nState());
        }, [
            InternationalizationStoreActions.ChangeLocale,
            RESET_SCOPE_ACTION,
            RESTORE_SCOPE_ACTION
        ]);
    }, []);
    return i18nState;
};
const createTranslatorHook = (container) => (translateUnitKey, context) => {
    const internationalizationStore = container[LIGUI_TYPES.INTERNATIONALIZATION_STORE];
    const internationalizationService = container[LIGUI_TYPES.INTERNATIONALIZATION_SERVICE];
    const internationalizationContext = context || useContext(InternationalizationKeyContext);
    const getTranslator = () => {
        const translator = internationalizationService.getTranslator(internationalizationContext);
        translator.prefix = `${translateUnitKey}.`;
        return translator;
    };
    const getId = () => ({
        key: translateUnitKey,
        context: internationalizationContext,
        locale: internationalizationStore.getCurrentLocale()
    });
    const prepareTranslator = () => {
        const id = getId();
        if (internationalizationStore.isTranslateUnitExist(id)) {
            return getTranslator();
        }
        const translateUnit = internationalizationService.loadTranslateUnit(id);
        return translateUnit instanceof Promise ? null : getTranslator();
    };
    const [translator, setTranslator] = useState(prepareTranslator);
    useEffect(() => {
        return internationalizationStore.subscribe(event => {
            if (event.actionName === InternationalizationStoreActions.UpdateTranslateUnits) {
                const translateUnitId = getId();
                const updatedTranslateUnits = event.props;
                const isTranslateUnitUpdated = updatedTranslateUnits.findIndex(it => isTranslateUnitsIdsEqual(it.id, translateUnitId)) >= 0;
                if (!isTranslateUnitUpdated) {
                    return;
                }
            }
            const translator = prepareTranslator();
            if (translator) {
                setTranslator(() => translator);
            }
        }, [
            InternationalizationStoreActions.ChangeLocale,
            InternationalizationStoreActions.UpdateTranslateUnits,
            RESET_SCOPE_ACTION,
            RESTORE_SCOPE_ACTION
        ]);
    }, []);
    return [
        translator || ((id, defaultValue) => defaultValue),
        !!translator
    ];
};

let ConfigKeyContext = null;
if (!!React) {
    ConfigKeyContext = createContext$1(undefined);
}
const createConfigHook = (container) => (key, context) => {
    const configStore = container[LIGUI_TYPES.CONFIG_STORE];
    const configService = container[LIGUI_TYPES.CONFIG_SERVICE];
    const configContext = context || useContext(ConfigKeyContext);
    const id = { key, context: configContext };
    const prepareConfigData = () => {
        if (configStore.isConfigExist(id)) {
            return configStore.findConfigById(id).data;
        }
        const config = configService.loadConfig(id);
        return config instanceof Promise ? null : config.data;
    };
    const [config, setConfig] = useState(prepareConfigData);
    useEffect(() => {
        if (config) {
            return;
        }
        Promise.resolve(configService.loadConfig(id)).then(config => setConfig(() => config.data));
    }, [config]);
    return config;
};

function createNewLiguiInstance(config) {
    // Check Ligui instance is present for HMR
    if (!!global[config.name]) {
        throw new Error(`Ligui instance present in global object with name: ${config.name}`);
    }
    const context = createContext(config.name, config.bottle);
    context.bottle.constant(LIGUI_TYPES.STORE, context.store);
    context.bottle.constant(LIGUI_TYPES.EVENT_BUS, context.eventBus);
    context.bottle.factory(LIGUI_TYPES.CONFIG_STORE, () => createConfigStore(context.store, {
        configs: config.configs
    }));
    context.bottle.factory(LIGUI_TYPES.INTERNATIONALIZATION_STORE, () => createInternationalizationStore(context.store, {
        locales: config.locales,
        currentLocale: config.currentLocale,
        defaultLocale: config.defaultLocale,
        translateUnits: config.translateUnits
    }));
    context.bottle.factory(LIGUI_TYPES.MODULE_STORE, () => createModuleStore(context.store, {
        modules: config.modules
    }));
    context.bottle.factory(LIGUI_TYPES.RESOURCE_STORE, () => createResourceStore(context.store, {
        resources: config.resources
    }));
    context.bottle.factory(LIGUI_TYPES.CONFIG_SERVICE, (container) => new ConfigServiceImpl(container[LIGUI_TYPES.CONFIG_STORE], config.configLoaders));
    context.bottle.factory(LIGUI_TYPES.INTERNATIONALIZATION_SERVICE, (container) => new InternationalizationServiceImpl(container[LIGUI_TYPES.INTERNATIONALIZATION_STORE], config.internationalizationLoaders));
    context.bottle.factory(LIGUI_TYPES.JSX_SERVICE, () => new JSXServiceImpl());
    context.bottle.factory(LIGUI_TYPES.MODULE_SERVICE, (container) => new ModuleServiceImpl(container[LIGUI_TYPES.MODULE_STORE], config.moduleLoaders));
    context.bottle.factory(LIGUI_TYPES.REPOSITORY_SERVICE, () => new RepositoryServiceImpl());
    context.bottle.factory(LIGUI_TYPES.RESOURCE_SERVICE, (container) => new ResourceServiceImpl(container[LIGUI_TYPES.RESOURCE_STORE], config.resourceLoaders));
    const ligui = {
        get jsx() {
            return context.bottle.container[LIGUI_TYPES.JSX_SERVICE];
        },
        get resource() {
            return {
                store: context.bottle.container[LIGUI_TYPES.RESOURCE_STORE],
                service: context.bottle.container[LIGUI_TYPES.RESOURCE_SERVICE]
            };
        },
        get internationalization() {
            return {
                store: context.bottle.container[LIGUI_TYPES.INTERNATIONALIZATION_STORE],
                service: context.bottle.container[LIGUI_TYPES.INTERNATIONALIZATION_SERVICE]
            };
        },
        get config() {
            return {
                store: context.bottle.container[LIGUI_TYPES.CONFIG_STORE],
                service: context.bottle.container[LIGUI_TYPES.CONFIG_SERVICE]
            };
        },
        get module() {
            return {
                store: context.bottle.container[LIGUI_TYPES.MODULE_STORE],
                service: context.bottle.container[LIGUI_TYPES.MODULE_SERVICE]
            };
        },
        get repository() {
            return context.bottle.container[LIGUI_TYPES.REPOSITORY_SERVICE];
        },
        get context() {
            return context;
        },
        get store() {
            return context.store;
        },
        get eventBus() {
            return context.eventBus;
        },
        get bottle() {
            return context.bottle;
        },
        get container() {
            return context.bottle.container;
        },
        createStore: createStore,
        isStoreExist: isStoreExist,
        getState: getState,
        getStore: getStore,
        setStoreDevTool: setStoreDevTool,
        createEventBus: createEventBus,
        isEventBusExist: isEventBusExist,
        getEventBus: getEventBus,
        setEventBusDevTool: setEventBusDevTool,
        useId,
        useRef,
        useData,
        useState: createStateHook(context.store),
        useEvent: createEventHook(context.eventBus),
        useModule: createModuleHook(context.bottle.container),
        useResource: createResourceHook(context.bottle.container),
        useI18n: createI18nHook(context.bottle.container),
        useTranslator: createTranslatorHook(context.bottle.container),
        useConfig: createConfigHook(context.bottle.container),
        useDependency: createDependencyHook(context.bottle.container),
    };
    global[config.name] = ligui;
    return ligui;
}

export { ConfigKeyContext, ConfigServiceImpl, ConfigStoreActions, InternationalizationKeyContext, InternationalizationServiceImpl, InternationalizationStoreActions, JSXServiceImpl, LIGUI_TYPES, ModuleKeyContext, ModuleServiceImpl, ModuleStoreActions, RepositoryServiceImpl, ResourceKeyContext, ResourceServiceImpl, ResourceStoreActions, classes, createConfigHook, createConfigStore, createContext, createDependencyHook, createEventHook, createI18nHook, createInternationalizationStore, createModuleHook, createModuleStore, createNewLiguiInstance, createResourceHook, createResourceStore, createStateHook, createTranslatorHook, eventTrap, isConfigsIdsEqual, isModifiedEvent, isModulesIdsEqual, isResourcesIdsEqual, isTranslateUnitsIdsEqual, mergeRefs, styles, useData, useId, useRef };
