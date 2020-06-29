import * as React from 'react';
import { createElement, useState, useEffect, useMemo, useRef as useRef$1, createContext as createContext$1, useContext } from 'react';
import { hydrate, render } from 'react-dom';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, basedir, module) {
	return module = {
	  path: basedir,
	  exports: {},
	  require: function (path, base) {
      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    }
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var bottle = createCommonjsModule(function (module, exports) {
(function(undefined$1) {
    /**
     * BottleJS v1.7.2 - 2019-02-07
     * A powerful dependency injection micro container
     *
     * Copyright (c) 2019 Stephen Young
     * Licensed MIT
     */
    var Bottle;
    
    /**
     * String constants
     */
    var DELIMITER = '.';
    var FUNCTION_TYPE = 'function';
    var STRING_TYPE = 'string';
    var GLOBAL_NAME = '__global__';
    var PROVIDER_SUFFIX = 'Provider';
    
    /**
     * Unique id counter;
     *
     * @type Number
     */
    var id = 0;
    
    /**
     * Local slice alias
     *
     * @type Functions
     */
    var slice = Array.prototype.slice;
    
    /**
     * Iterator used to walk down a nested object.
     *
     * If Bottle.config.strict is true, this method will throw an exception if it encounters an
     * undefined path
     *
     * @param Object obj
     * @param String prop
     * @return mixed
     * @throws Error if Bottle is unable to resolve the requested service.
     */
    var getNested = function getNested(obj, prop) {
        var service = obj[prop];
        if (service === undefined$1 && Bottle.config.strict) {
            throw new Error('Bottle was unable to resolve a service.  `' + prop + '` is undefined.');
        }
        return service;
    };
    
    /**
     * Get a nested bottle. Will set and return if not set.
     *
     * @param String name
     * @return Bottle
     */
    var getNestedBottle = function getNestedBottle(name) {
        var bottle;
        if (!this.nested[name]) {
            bottle = Bottle.pop();
            this.nested[name] = bottle;
            this.factory(name, function SubProviderFactory() {
                return bottle.container;
            });
        }
        return this.nested[name];
    };
    
    /**
     * Get a service stored under a nested key
     *
     * @param String fullname
     * @return Service
     */
    var getNestedService = function getNestedService(fullname) {
        return fullname.split(DELIMITER).reduce(getNested, this);
    };
    
    /**
     * Function used by provider to set up middleware for each request.
     *
     * @param Number id
     * @param String name
     * @param Object instance
     * @param Object container
     * @return void
     */
    var applyMiddleware = function applyMiddleware(middleware, name, instance, container) {
        var descriptor = {
            configurable : true,
            enumerable : true
        };
        if (middleware.length) {
            descriptor.get = function getWithMiddlewear() {
                var index = 0;
                var next = function nextMiddleware(err) {
                    if (err) {
                        throw err;
                    }
                    if (middleware[index]) {
                        middleware[index++](instance, next);
                    }
                };
                next();
                return instance;
            };
        } else {
            descriptor.value = instance;
            descriptor.writable = true;
        }
    
        Object.defineProperty(container, name, descriptor);
    
        return container[name];
    };
    
    /**
     * Register middleware.
     *
     * @param String name
     * @param Function func
     * @return Bottle
     */
    var middleware = function middleware(fullname, func) {
        var parts, name;
        if (typeof fullname === FUNCTION_TYPE) {
            func = fullname;
            fullname = GLOBAL_NAME;
        }
    
        parts = fullname.split(DELIMITER);
        name = parts.shift();
        if (parts.length) {
            getNestedBottle.call(this, name).middleware(parts.join(DELIMITER), func);
        } else {
            if (!this.middlewares[name]) {
                this.middlewares[name] = [];
            }
            this.middlewares[name].push(func);
        }
        return this;
    };
    
    /**
     * Used to process decorators in the provider
     *
     * @param Object instance
     * @param Function func
     * @return Mixed
     */
    var reducer = function reducer(instance, func) {
        return func(instance);
    };
    
    
    /**
     * Get decorators and middleware including globals
     *
     * @return array
     */
    var getWithGlobal = function getWithGlobal(collection, name) {
        return (collection[name] || []).concat(collection.__global__ || []);
    };
    
    
    /**
     * Create the provider properties on the container
     *
     * @param String name
     * @param Function Provider
     * @return Bottle
     */
    var createProvider = function createProvider(name, Provider) {
        var providerName, properties, container, id, decorators, middlewares;
    
        id = this.id;
        container = this.container;
        decorators = this.decorators;
        middlewares = this.middlewares;
        providerName = name + PROVIDER_SUFFIX;
    
        properties = Object.create(null);
        properties[providerName] = {
            configurable : true,
            enumerable : true,
            get : function getProvider() {
                var instance = new Provider();
                delete container[providerName];
                container[providerName] = instance;
                return instance;
            }
        };
    
        properties[name] = {
            configurable : true,
            enumerable : true,
            get : function getService() {
                var provider = container[providerName];
                var instance;
                if (provider) {
                    // filter through decorators
                    instance = getWithGlobal(decorators, name).reduce(reducer, provider.$get(container));
    
                    delete container[providerName];
                    delete container[name];
                }
                return instance === undefined$1 ? instance : applyMiddleware(getWithGlobal(middlewares, name),
                    name, instance, container);
            }
        };
    
        Object.defineProperties(container, properties);
        return this;
    };
    
    
    /**
     * Register a provider.
     *
     * @param String fullname
     * @param Function Provider
     * @return Bottle
     */
    var provider = function provider(fullname, Provider) {
        var parts, name;
        parts = fullname.split(DELIMITER);
        if (this.providerMap[fullname] && parts.length === 1 && !this.container[fullname + PROVIDER_SUFFIX]) {
            return console.error(fullname + ' provider already instantiated.');
        }
        this.originalProviders[fullname] = Provider;
        this.providerMap[fullname] = true;
    
        name = parts.shift();
    
        if (parts.length) {
            getNestedBottle.call(this, name).provider(parts.join(DELIMITER), Provider);
            return this;
        }
        return createProvider.call(this, name, Provider);
    };
    
    /**
     * Register a factory inside a generic provider.
     *
     * @param String name
     * @param Function Factory
     * @return Bottle
     */
    var factory = function factory(name, Factory) {
        return provider.call(this, name, function GenericProvider() {
            this.$get = Factory;
        });
    };
    
    /**
     * Private helper for creating service and service factories.
     *
     * @param String name
     * @param Function Service
     * @return Bottle
     */
    var createService = function createService(name, Service, isClass) {
        var deps = arguments.length > 3 ? slice.call(arguments, 3) : [];
        var bottle = this;
        return factory.call(this, name, function GenericFactory() {
            var serviceFactory = Service; // alias for jshint
            var args = deps.map(getNestedService, bottle.container);
    
            if (!isClass) {
                return serviceFactory.apply(null, args);
            }
            return new (Service.bind.apply(Service, [null].concat(args)))();
        });
    };
    
    /**
     * Register a class service
     *
     * @param String name
     * @param Function Service
     * @return Bottle
     */
    var service = function service(name, Service) {
        return createService.apply(this, [name, Service, true].concat(slice.call(arguments, 2)));
    };
    
    /**
     * Register a function service
     */
    var serviceFactory = function serviceFactory(name, factoryService) {
        return createService.apply(this, [name, factoryService, false].concat(slice.call(arguments, 2)));
    };
    
    /**
     * Define a mutable property on the container.
     *
     * @param String name
     * @param mixed val
     * @return void
     * @scope container
     */
    var defineValue = function defineValue(name, val) {
        Object.defineProperty(this, name, {
            configurable : true,
            enumerable : true,
            value : val,
            writable : true
        });
    };
    
    /**
     * Iterator for setting a plain object literal via defineValue
     *
     * @param Object container
     * @param string name
     */
    var setValueObject = function setValueObject(container, name) {
        var nestedContainer = container[name];
        if (!nestedContainer) {
            nestedContainer = {};
            defineValue.call(container, name, nestedContainer);
        }
        return nestedContainer;
    };
    
    
    /**
     * Register a value
     *
     * @param String name
     * @param mixed val
     * @return Bottle
     */
    var value = function value(name, val) {
        var parts;
        parts = name.split(DELIMITER);
        name = parts.pop();
        defineValue.call(parts.reduce(setValueObject, this.container), name, val);
        return this;
    };
    
    /**
     * Define an enumerable, non-configurable, non-writable value.
     *
     * @param String name
     * @param mixed value
     * @return undefined
     */
    var defineConstant = function defineConstant(name, value) {
        Object.defineProperty(this, name, {
            configurable : false,
            enumerable : true,
            value : value,
            writable : false
        });
    };
    
    /**
     * Register a constant
     *
     * @param String name
     * @param mixed value
     * @return Bottle
     */
    var constant = function constant(name, value) {
        var parts = name.split(DELIMITER);
        name = parts.pop();
        defineConstant.call(parts.reduce(setValueObject, this.container), name, value);
        return this;
    };
    
    /**
     * Register decorator.
     *
     * @param String fullname
     * @param Function func
     * @return Bottle
     */
    var decorator = function decorator(fullname, func) {
        var parts, name;
        if (typeof fullname === FUNCTION_TYPE) {
            func = fullname;
            fullname = GLOBAL_NAME;
        }
    
        parts = fullname.split(DELIMITER);
        name = parts.shift();
        if (parts.length) {
            getNestedBottle.call(this, name).decorator(parts.join(DELIMITER), func);
        } else {
            if (!this.decorators[name]) {
                this.decorators[name] = [];
            }
            this.decorators[name].push(func);
        }
        return this;
    };
    
    /**
     * Register a function that will be executed when Bottle#resolve is called.
     *
     * @param Function func
     * @return Bottle
     */
    var defer = function defer(func) {
        this.deferred.push(func);
        return this;
    };
    
    
    /**
     * Immediately instantiates the provided list of services and returns them.
     *
     * @param Array services
     * @return Array Array of instances (in the order they were provided)
     */
    var digest = function digest(services) {
        return (services || []).map(getNestedService, this.container);
    };
    
    /**
     * Register an instance factory inside a generic factory.
     *
     * @param {String} name - The name of the service
     * @param {Function} Factory - The factory function, matches the signature required for the
     * `factory` method
     * @return Bottle
     */
    var instanceFactory = function instanceFactory(name, Factory) {
        return factory.call(this, name, function GenericInstanceFactory(container) {
            return {
                instance : Factory.bind(Factory, container)
            };
        });
    };
    
    /**
     * A filter function for removing bottle container methods and providers from a list of keys
     */
    var byMethod = function byMethod(name) {
        return !/^\$(?:decorator|register|list)$|Provider$/.test(name);
    };
    
    /**
     * List the services registered on the container.
     *
     * @param Object container
     * @return Array
     */
    var list = function list(container) {
        return Object.keys(container || this.container || {}).filter(byMethod);
    };
    
    /**
     * Named bottle instances
     *
     * @type Object
     */
    var bottles = {};
    
    /**
     * Get an instance of bottle.
     *
     * If a name is provided the instance will be stored in a local hash.  Calling Bottle.pop multiple
     * times with the same name will return the same instance.
     *
     * @param String name
     * @return Bottle
     */
    var pop = function pop(name) {
        var instance;
        if (typeof name === STRING_TYPE) {
            instance = bottles[name];
            if (!instance) {
                bottles[name] = instance = new Bottle();
                instance.constant('BOTTLE_NAME', name);
            }
            return instance;
        }
        return new Bottle();
    };
    
    /**
     * Clear all named bottles.
     */
    var clear = function clear(name) {
        if (typeof name === STRING_TYPE) {
            delete bottles[name];
        } else {
            bottles = {};
        }
    };
    
    /**
     * Register a service, factory, provider, or value based on properties on the object.
     *
     * properties:
     *  * Obj.$name   String required ex: `'Thing'`
     *  * Obj.$type   String optional 'service', 'factory', 'provider', 'value'.  Default: 'service'
     *  * Obj.$inject Mixed  optional only useful with $type 'service' name or array of names
     *  * Obj.$value  Mixed  optional Normally Obj is registered on the container.  However, if this
     *                       property is included, it's value will be registered on the container
     *                       instead of the object itsself.  Useful for registering objects on the
     *                       bottle container without modifying those objects with bottle specific keys.
     *
     * @param Function Obj
     * @return Bottle
     */
    var register = function register(Obj) {
        var value = Obj.$value === undefined$1 ? Obj : Obj.$value;
        return this[Obj.$type || 'service'].apply(this, [Obj.$name, value].concat(Obj.$inject || []));
    };
    
    /**
     * Deletes providers from the map and container.
     *
     * @param String name
     * @return void
     */
    var removeProviderMap = function resetProvider(name) {
        delete this.providerMap[name];
        delete this.container[name];
        delete this.container[name + PROVIDER_SUFFIX];
    };
    
    /**
     * Resets providers on a bottle instance. If 'names' array is provided, only the named providers will be reset.
     *
     * @param Array names
     * @return void
     */
    var resetProviders = function resetProviders(names) {
        var tempProviders = this.originalProviders;
        var shouldFilter = Array.isArray(names);
    
        Object.keys(this.originalProviders).forEach(function resetProvider(originalProviderName) {
            if (shouldFilter && names.indexOf(originalProviderName) === -1) {
                return;
            }
            var parts = originalProviderName.split(DELIMITER);
            if (parts.length > 1) {
                parts.forEach(removeProviderMap, getNestedBottle.call(this, parts[0]));
            }
            removeProviderMap.call(this, originalProviderName);
            this.provider(originalProviderName, tempProviders[originalProviderName]);
        }, this);
    };
    
    
    /**
     * Execute any deferred functions
     *
     * @param Mixed data
     * @return Bottle
     */
    var resolve = function resolve(data) {
        this.deferred.forEach(function deferredIterator(func) {
            func(data);
        });
    
        return this;
    };
    
    
    /**
     * Bottle constructor
     *
     * @param String name Optional name for functional construction
     */
    Bottle = function Bottle(name) {
        if (!(this instanceof Bottle)) {
            return Bottle.pop(name);
        }
    
        this.id = id++;
    
        this.decorators = {};
        this.middlewares = {};
        this.nested = {};
        this.providerMap = {};
        this.originalProviders = {};
        this.deferred = [];
        this.container = {
            $decorator : decorator.bind(this),
            $register : register.bind(this),
            $list : list.bind(this)
        };
    };
    
    /**
     * Bottle prototype
     */
    Bottle.prototype = {
        constant : constant,
        decorator : decorator,
        defer : defer,
        digest : digest,
        factory : factory,
        instanceFactory: instanceFactory,
        list : list,
        middleware : middleware,
        provider : provider,
        resetProviders : resetProviders,
        register : register,
        resolve : resolve,
        service : service,
        serviceFactory : serviceFactory,
        value : value
    };
    
    /**
     * Bottle static
     */
    Bottle.pop = pop;
    Bottle.clear = clear;
    Bottle.list = list;
    
    /**
     * Global config
     */
    Bottle.config = {
        strict : false
    };
    
    /**
     * Exports script adapted from lodash v2.4.1 Modern Build
     *
     * @see http://lodash.com/
     */
    
    /**
     * Valid object type map
     *
     * @type Object
     */
    var objectTypes = {
        'function' : true,
        'object' : true
    };
    
    (function exportBottle(root) {
    
        /**
         * Free variable exports
         *
         * @type Function
         */
        var freeExports = objectTypes['object'] && exports && !exports.nodeType && exports;
    
        /**
         * Free variable module
         *
         * @type Object
         */
        var freeModule = objectTypes['object'] && module && !module.nodeType && module;
    
        /**
         * CommonJS module.exports
         *
         * @type Function
         */
        var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;
    
        /**
         * Free variable `global`
         *
         * @type Object
         */
        var freeGlobal = objectTypes[typeof commonjsGlobal] && commonjsGlobal;
        if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
            root = freeGlobal;
        }
    
        /**
         * Export
         */
        if (typeof undefined$1 === FUNCTION_TYPE && typeof undefined$1.amd === 'object' && undefined$1.amd) {
            root.Bottle = Bottle;
            undefined$1(function() { return Bottle; });
        } else if (freeExports && freeModule) {
            if (moduleExports) {
                (freeModule.exports = Bottle).Bottle = Bottle;
            } else {
                freeExports.Bottle = Bottle;
            }
        } else {
            root.Bottle = Bottle;
        }
    }((objectTypes[typeof window] && window) || this));
    
}.call(commonjsGlobal));
});

const generateSalt = (length = 16, sample = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
    let result = '';
    while (result.length < length) {
        result += sample.charAt(Math.floor(Math.random() * sample.length));
    }
    return result;
};
const generateUUID = () => `${generateSalt(4)}-${generateSalt(4)}-${generateSalt(4)}-${generateSalt(4)}`;
const createUniqueIdGenerator = (prefix) => {
    let index = 0;
    const uuid = generateUUID();
    const uniquePrefix = `${prefix}:${uuid}`;
    return () => `${uniquePrefix}:${++index}`;
};

function deepFreeze(obj) {
    Object.getOwnPropertyNames(obj).forEach(function (key) {
        let prop = obj[key];
        if (typeof prop === 'object' && prop !== null) {
            deepFreeze(prop);
        }
    });
    return Object.freeze(obj);
}

var ScopeMacroType;
(function (ScopeMacroType) {
    ScopeMacroType["GETTER"] = "GETTER";
    ScopeMacroType["SETTER"] = "SETTER";
    ScopeMacroType["FUNCTION"] = "FUNCTION";
})(ScopeMacroType || (ScopeMacroType = {}));
var ScopeChangeEventType;
(function (ScopeChangeEventType) {
    ScopeChangeEventType["REGISTER_MACRO"] = "REGISTER_MACRO";
    ScopeChangeEventType["REGISTER_ACTION"] = "REGISTER_ACTION";
    ScopeChangeEventType["LOCK"] = "LOCK";
})(ScopeChangeEventType || (ScopeChangeEventType = {}));
var StoreChangeEventType;
(function (StoreChangeEventType) {
    StoreChangeEventType["CREATE_SCOPE"] = "CREATE_SCOPE";
    StoreChangeEventType["LOCK"] = "LOCK";
})(StoreChangeEventType || (StoreChangeEventType = {}));
const stores = new Map();
const storeDevTool = {
    onCreateStore: () => null,
    onChangeStore: () => null,
    onCreateScope: () => null,
    onChangeScope: () => null,
    onAction: () => null,
    onActionError: () => null,
    onActionListenerError: () => null
};
const RESET_SCOPE_ACTION = '_reset';
const RESTORE_SCOPE_ACTION = '_restore';
class ScopeImpl {
    constructor(store, config) {
        this._context = null;
        this._contextEvent = null;
        this._isActionInProgress = false;
        this._actions = new Map();
        this._listeners = new Map();
        this._listenerIdGenerator = createUniqueIdGenerator('ScopeListener');
        const { name, initState, middleware, isImmutabilityEnabled, isSubscribedMacroAutoCreateEnabled, isFrozen } = config;
        this.store = store;
        this.name = name;
        this.isImmutabilityEnabled = isImmutabilityEnabled;
        this.isSubscribedMacroAutoCreateEnabled = isSubscribedMacroAutoCreateEnabled;
        this._state = initState;
        this._initState = initState;
        // This code needed to save middleware correct order in dispatch method.
        this._middleware = [...middleware].reverse();
        this.registerAction(RESET_SCOPE_ACTION, () => this._initState);
        this.registerAction(RESTORE_SCOPE_ACTION, (_, restoredState) => {
            this._initState = restoredState;
            return restoredState;
        });
        this._isFrozen = isFrozen;
    }
    get isLocked() {
        return this._isFrozen;
    }
    get isActionDispatchAvailable() {
        return !this._isActionInProgress;
    }
    get state() {
        return this._state;
    }
    get context() {
        return this._context;
    }
    get supportActions() {
        return Array.from(this._actions.keys());
    }
    registerAction(actionName, action, transformer) {
        if (this._isFrozen) {
            throw new Error(`This scope is locked you can't add new action.`);
        }
        if (this._actions.has(actionName) || (this.isSubscribedMacroAutoCreateEnabled && actionName in this)) {
            throw new Error(`Action name ${actionName} is duplicate or reserved in scope ${this.name}.`);
        }
        this._actions.set(actionName, action);
        const actionDispatcher = (props, emitEvent) => {
            const dispatchResult = this.dispatch(actionName, props, emitEvent);
            return transformer ? transformer(dispatchResult, props) : dispatchResult;
        };
        if (this.isSubscribedMacroAutoCreateEnabled) {
            const capitalizeFirstLetterActionName = () => {
                return actionName.charAt(0).toUpperCase() + actionName.slice(1);
            };
            const subscriberMacroName = `on${capitalizeFirstLetterActionName()}`;
            this.registerMacro(subscriberMacroName, (state, listener) => {
                return this.subscribe(listener, [actionName]);
            });
        }
        this[actionName] = actionDispatcher;
        storeDevTool.onChangeScope(this, { type: ScopeChangeEventType.REGISTER_ACTION, actionName });
        return actionDispatcher;
    }
    registerMacro(macroName, macro, macroType = ScopeMacroType.FUNCTION) {
        if (!macro) {
            throw new Error(`Macro cannot be null or undefined.`);
        }
        if (this._isFrozen) {
            throw new Error(`This scope is locked you can't add new macro.`);
        }
        const isMacroExist = macroName in this;
        const isPresentMacroHasFunctionType = () => typeof this[macroName] === 'function';
        if (isMacroExist
            && (isPresentMacroHasFunctionType()
                || macroType === ScopeMacroType.FUNCTION
                || (macroType === ScopeMacroType.GETTER && Object.getOwnPropertyDescriptor(this, macroName).get)
                || (macroType === ScopeMacroType.SETTER && Object.getOwnPropertyDescriptor(this, macroName).set))) {
            throw new Error(`Macro name ${macroName} is reserved in scope ${this.name}.`);
        }
        const macroFunc = (props) => {
            return macro(this._state, props);
        };
        switch (macroType) {
            case ScopeMacroType.FUNCTION:
                this[macroName] = macroFunc;
                break;
            case ScopeMacroType.GETTER:
                Object.defineProperty(this, macroName, { get: macroFunc, configurable: true, enumerable: true });
                break;
            case ScopeMacroType.SETTER:
                Object.defineProperty(this, macroName, { set: macroFunc, configurable: true, enumerable: true });
                break;
        }
        storeDevTool.onChangeScope(this, { type: ScopeChangeEventType.REGISTER_MACRO, macroName, macroType });
    }
    dispatch(actionName, props, emitEvent = true) {
        let action = this._actions.get(actionName);
        if (!action) {
            throw new Error(`This action not exists ${actionName}`);
        }
        if (this._isActionInProgress) {
            throw new Error('Now action dispatch not available. Other action spreads.');
        }
        if (this.isImmutabilityEnabled && !!props && typeof props === 'object') {
            deepFreeze(props);
        }
        this._middleware.forEach(middleware => action = middleware.appendActionMiddleware(action));
        const isRootAction = !this._isActionInProgress;
        if (isRootAction) {
            this._isActionInProgress = true;
        }
        const oldState = isRootAction ? this._state : this._context;
        const buildScopeError = (reason) => ({
            reason,
            oldState,
            scopeName: this.name,
            actionName,
            props
        });
        const buildScopeEvent = (newState) => ({
            props,
            oldState,
            newState,
            actionName,
            parentEvent: this._contextEvent ?? null,
            scopeName: this.name,
            storeName: this.store.name,
            childrenEvents: []
        });
        const onFulfilled = newState => {
            if (this.isImmutabilityEnabled && !!newState && typeof props === 'object') {
                deepFreeze(newState);
            }
            this._context = newState;
            if (emitEvent) {
                isRootAction
                    ? this._contextEvent = buildScopeEvent(newState)
                    : this?._contextEvent.childrenEvents.push(buildScopeEvent(newState));
            }
            const dispatchEvent = (event) => {
                storeDevTool.onAction(event);
                this._listeners.forEach(listener => {
                    try {
                        listener?.(event);
                    }
                    catch (reason) {
                        storeDevTool.onActionListenerError(buildScopeError(reason));
                    }
                });
            };
            if (isRootAction) {
                this._state = newState;
                if (this._contextEvent) {
                    this._contextEvent.childrenEvents.forEach(dispatchEvent);
                    dispatchEvent(this._contextEvent);
                }
                this._context = null;
                this._contextEvent = null;
                this._isActionInProgress = false;
            }
            return newState;
        };
        const onRejected = reason => {
            const error = buildScopeError(reason);
            if (isRootAction) {
                storeDevTool.onActionError(error);
            }
            return error;
        };
        try {
            return onFulfilled(action(oldState, props));
        }
        catch (e) {
            throw onRejected(e);
        }
    }
    subscribe(listener, actionNames = []) {
        actionNames.forEach(actionName => {
            if (!this._actions.has(actionName)) {
                throw new Error(`Action (${actionName}) not present in scope.`);
            }
        });
        const listenerId = this._listenerIdGenerator();
        const accurateListener = event => {
            const isActionPresentInScope = actionNames.findIndex(actionName => actionName === event.actionName) !== -1;
            if (isActionPresentInScope) {
                listener(event);
            }
        };
        this._listeners.set(listenerId, actionNames.length === 0 ? listener : accurateListener);
        return Object.assign(() => this.unsubscribe(listenerId), { listenerId });
    }
    unsubscribe(id) {
        return this._listeners.delete(id);
    }
    lock() {
        this._isFrozen = true;
        storeDevTool.onChangeScope(this, { type: ScopeChangeEventType.LOCK });
    }
    reset(emitEvent) {
        return this.dispatch(RESET_SCOPE_ACTION, null, emitEvent);
    }
    restore(restoredState, emitEvent) {
        return this.dispatch(RESTORE_SCOPE_ACTION, restoredState, emitEvent);
    }
}
class StoreImpl {
    constructor(config) {
        this._scopes = new Map();
        this._statesToRestore = new Map();
        this._scopeNameGenerator = createUniqueIdGenerator('Scope');
        this.name = config.name;
        this._isFrozen = config.isFrozen;
    }
    get isLocked() {
        return this._isFrozen;
    }
    get state() {
        const state = {};
        this._scopes.forEach(scope => {
            state[scope.name] = scope.state;
        });
        return state;
    }
    createScope(config = {}, useRestoredStateIfAvailable) {
        if (this._isFrozen) {
            throw new Error(`This Store is locked you can't add new scope.`);
        }
        const { name = this._scopeNameGenerator(), initState = null, middleware = [], isImmutabilityEnabled = false, isSubscribedMacroAutoCreateEnabled = false, isFrozen = false } = config;
        if (this._scopes.has(name)) {
            throw new Error(`Scope name must unique`);
        }
        const useRestoredState = useRestoredStateIfAvailable && this._statesToRestore.has(name);
        const state = useRestoredState
            ? this._statesToRestore.get(name)
            : initState;
        if (useRestoredState) {
            this._statesToRestore.delete(name);
        }
        let scope = new ScopeImpl(this, {
            name,
            initState: state,
            middleware: middleware,
            isImmutabilityEnabled,
            isSubscribedMacroAutoCreateEnabled,
            isFrozen
        });
        this._scopes.set(name, scope);
        middleware.forEach(middleware => middleware.postSetup(scope));
        storeDevTool.onCreateScope(scope);
        storeDevTool.onChangeStore(this, { type: StoreChangeEventType.CREATE_SCOPE, scopeName: name });
        return scope;
    }
    getScope(scopeName) {
        return this._scopes.get(scopeName);
    }
    hasScope(scopeName) {
        return this._scopes.has(scopeName);
    }
    lock() {
        this._isFrozen = true;
        this._scopes.forEach(it => it.lock());
        storeDevTool.onChangeStore(this, { type: StoreChangeEventType.LOCK });
    }
    reset(emitEvent) {
        this._scopes.forEach(scope => scope.reset(emitEvent));
    }
    restore(restoredStates, emitEvent) {
        Object.getOwnPropertyNames(restoredStates).forEach(restoredScopeName => {
            const restoredState = restoredStates[restoredScopeName];
            this.hasScope(restoredScopeName)
                ? this.getScope(restoredScopeName).restore(restoredState, emitEvent)
                : this._statesToRestore.set(restoredScopeName, restoredState);
        });
    }
}
/**
 * @function isStoreExist
 * @summary Check is store exist.
 * @param {string} storeName Name of store.
 * @return {boolean} Status of store exist.
 */
function isStoreExist(storeName) {
    return stores.has(storeName);
}
/**
 * @function createStore
 * @summary Create a new store and return it.
 * @param {StoreConfig} config Name of store.
 * @return {Store} Store.
 * @throws {Error} Will throw an error if name of store not unique.
 */
function createStore(config) {
    const { name, isFrozen = false } = config;
    if (isStoreExist(name)) {
        throw new Error('Store name must unique');
    }
    const store = new StoreImpl({ name, isFrozen });
    stores.set(name, store);
    storeDevTool.onCreateStore(store);
    return store;
}
/**
 * @function getStore
 * @summary Returns store.
 * @param {string} storeName Name scope, to get the Scope.
 * @return {Store} Store or null
 */
function getStore(storeName) {
    return stores.get(storeName);
}
/**
 * @function getState
 * @summary Returns all store states.
 * @return {{string: {[key: string]: any}}} Scope states
 */
function getState() {
    const state = {};
    stores.forEach(store => {
        state[store.name] = store.state;
    });
    return state;
}
/**
 * @function setStoreDevTool
 * @summary Set store dev tool.
 * @param {StoreDevTool} devTool Dev tool middleware, to handle store changes.
 */
function setStoreDevTool(devTool) {
    Object.assign(storeDevTool, devTool);
}

const generateSalt$1 = (length = 16, sample = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
    let result = '';
    while (result.length < length) {
        result += sample.charAt(Math.floor(Math.random() * sample.length));
    }
    return result;
};
const generateUUID$1 = () => `${generateSalt$1(4)}-${generateSalt$1(4)}-${generateSalt$1(4)}-${generateSalt$1(4)}`;
const createUniqueIdGenerator$1 = (prefix) => {
    let index = 0;
    const uuid = generateUUID$1();
    const uniquePrefix = `${prefix}:${uuid}`;
    return () => `${uniquePrefix}:${++index}`;
};

function deepFreeze$1(obj) {
    Object.getOwnPropertyNames(obj).forEach(function (key) {
        let prop = obj[key];
        if (typeof prop === 'object' && prop !== null) {
            deepFreeze$1(prop);
        }
    });
    return Object.freeze(obj);
}

const eventBuses = new Map();
const generateEventBusName = createUniqueIdGenerator$1('EventBus');
const generateEventBusListenerId = createUniqueIdGenerator$1('EventBusListener');
const eventBusDevTool = {
    onCreate: () => null,
    onEvent: () => null,
    onEventListenerError: () => null
};
class EventBusImpl {
    constructor(config) {
        this._events = [];
        this._queue = [];
        this._listeners = new Map();
        const { name, isFrozen, isImmutabilityEnabled } = config;
        this.name = name;
        this.isImmutabilityEnabled = isImmutabilityEnabled;
        this._isFrozen = isFrozen;
    }
    get isLocked() {
        return this._isFrozen;
    }
    get supportEvents() {
        return [...this._events];
    }
    registerEvent(eventName) {
        if (this._isFrozen) {
            throw new Error(`This event bus is locked you can't add new event.`);
        }
        if (this.isEventPresent(eventName) || (eventName in this)) {
            throw new Error(`Event with name ${eventName} is duplicate or reserved in event bus ${this.name}.`);
        }
        this._events.push(eventName);
        const capitalizeFirstLetterEventName = () => {
            return eventName.charAt(0).toUpperCase() + eventName.slice(1);
        };
        const subscriberMacroName = `on${capitalizeFirstLetterEventName()}`;
        const dispatcherMacroName = `publish${capitalizeFirstLetterEventName()}`;
        this[subscriberMacroName] = (listener) => {
            this.subscribe(listener, [eventName]);
        };
        const eventDispatcher = (data) => this.publish(eventName, data);
        this[dispatcherMacroName] = eventDispatcher;
        return eventDispatcher;
    }
    publish(eventName, data) {
        const eventDispatcher = () => {
            if (this.isImmutabilityEnabled && !!data && typeof data === 'object') {
                deepFreeze$1(data);
            }
            const event = {
                eventBusName: this.name,
                eventName,
                data
            };
            eventBusDevTool.onEvent(event);
            this._listeners.forEach(listener => {
                try {
                    if (listener) {
                        listener(event);
                    }
                }
                catch (reason) {
                    eventBusDevTool.onEventListenerError({ ...event, reason });
                }
            });
            this._queue.shift();
            if (this._queue.length > 0) {
                const nextEventDispatcher = this._queue[0];
                nextEventDispatcher();
            }
        };
        const isFirstInQuery = this._queue.length === 0;
        this._queue.push(eventDispatcher);
        if (isFirstInQuery) {
            eventDispatcher();
        }
    }
    subscribe(listener, eventNames = []) {
        eventNames.forEach(eventName => {
            if (!this.isEventPresent(eventName)) {
                throw new Error(`Event (${eventName}) not present in scope.`);
            }
        });
        const listenerId = generateEventBusListenerId();
        const accurateListener = event => {
            const isActionPresentInScope = eventNames.findIndex(eventName => eventName === event.eventName) !== -1;
            if (isActionPresentInScope) {
                listener(event);
            }
        };
        this._listeners.set(listenerId, eventNames.length === 0 ? listener : accurateListener);
        return Object.assign(() => this.unsubscribe(listenerId), { listenerId });
    }
    unsubscribe(id) {
        return this._listeners.delete(id);
    }
    lock() {
        this._isFrozen = true;
    }
    isEventPresent(eventName) {
        return this._events.findIndex(it => it === eventName) !== -1;
    }
}
function isEventBusExist(eventBusName) {
    return eventBuses.has(eventBusName);
}
function createEventBus(config = {}) {
    const { name = generateEventBusName(), isFrozen = false, isImmutabilityEnabled = false } = config;
    if (isEventBusExist(name)) {
        throw new Error(`Event bus name must unique`);
    }
    let eventBus = new EventBusImpl({ name, isFrozen, isImmutabilityEnabled });
    eventBuses.set(name, eventBus);
    eventBusDevTool.onCreate(eventBus);
    return eventBus;
}
function getEventBus(eventBusName) {
    return eventBuses.get(eventBusName);
}
function setEventBusDevTool(devTool) {
    Object.assign(eventBusDevTool, devTool);
}

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

function createContext(name, bottle$1 = new bottle(name)) {
    if (isStoreExist(name)) {
        throw new Error(`Ligui store exist with name ${name}`);
    }
    if (isEventBusExist(name)) {
        throw new Error(`Ligui event bus exist with name ${name}`);
    }
    return Object.freeze({
        store: createStore({ name }),
        eventBus: createEventBus({ name }),
        bottle: bottle$1
    });
}

const generateSalt$2 = (length = 16, sample = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
    let result = '';
    while (result.length < length) {
        result += sample.charAt(Math.floor(Math.random() * sample.length));
    }
    return result;
};
const generateUUID$2 = () => `${generateSalt$2(4)}-${generateSalt$2(4)}-${generateSalt$2(4)}-${generateSalt$2(4)}`;
const createUniqueIdGenerator$2 = (prefix) => {
    let index = 0;
    const uuid = generateUUID$2();
    const uniquePrefix = `${prefix}:${uuid}`;
    return () => `${uniquePrefix}:${++index}`;
};
const copyArray = (sources) => [...sources];
const saveToArray = (array, newEl, compareFn = (arrEl, newEl) => arrEl === newEl) => {
    const oldElIndex = array.findIndex((arrEl, index, arr) => compareFn(arrEl, newEl, index, arr));
    if (oldElIndex === -1) {
        array.push(newEl);
        return;
    }
    array[oldElIndex] = newEl;
};
const deleteFromArray = (array, compareFn) => {
    const deleteElIndex = array.findIndex(compareFn);
    if (deleteElIndex === -1) {
        return;
    }
    array.splice(deleteElIndex, 1);
};

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
        return {
            ...state,
            currentLocale: locale
        };
    });
    internationalizationStore.setTranslateUnits = internationalizationStore.registerAction(InternationalizationStoreActions.UpdateTranslateUnits, (state, translateUnits) => {
        const updatedTranslateUnits = copyArray(state.translateUnits);
        translateUnits.forEach(translateUnit => saveToArray(updatedTranslateUnits, translateUnit, existTranslateUnit => isTranslateUnitsIdsEqual(translateUnit.id, existTranslateUnit.id)));
        return {
            ...state,
            translateUnits: updatedTranslateUnits
        };
    });
    internationalizationStore.setTranslationForLocale = (locale, translationObject, context) => {
        const translationUnits = Object.getOwnPropertyNames(translationObject).map(key => ({
            id: { key, locale, context },
            data: translationObject[key]
        }));
        internationalizationStore.setTranslateUnits(translationUnits);
    };
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
        const translateUnitData = translateUnitLoader.loader(id.key, id.locale)
            ?? translateUnitLoader.loader(id.key, _store.state.defaultLocale);
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
        return (path, argsOrDefaultValue) => {
            if (typeof path !== 'string') {
                throw new Error(`Invalid translator arg path format ${path}`);
            }
            let resolvedArgs = {};
            if (typeof argsOrDefaultValue === 'string') {
                resolvedArgs = { defaultValue: argsOrDefaultValue };
            }
            else if (typeof argsOrDefaultValue === 'object') {
                resolvedArgs = argsOrDefaultValue;
            }
            const [key, ...pathParts] = path.split(/[.\[\]]/).filter(it => it !== '');
            const translateUnitId = { key, context, locale: locale || this._store.state.currentLocale };
            const defaultTranslateUnitId = { key, context, locale: this._store.state.defaultLocale };
            let translateUnit = this._store.findTranslateUnitById(translateUnitId)
                ?? this._store.findTranslateUnitById(defaultTranslateUnitId);
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
            const state = repository.collect?.();
            if (state) {
                result[id] = state;
            }
        });
        return result;
    }
    reset() {
        this._repositories.forEach(repository => repository.reset?.());
    }
    restore(restoredStates) {
        Object.getOwnPropertyNames(restoredStates).forEach(id => {
            const restoredState = restoredStates[id];
            this._repositories.has(id)
                ? this._repositories.get(id).restore?.(restoredState)
                : this._states.set(id, restoredState);
        });
    }
    registerRepository(id, repository, config = {}) {
        const { activeCollect = true, activeRestore = true, activeReset = true } = config;
        const repositoryProxy = {};
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

const idHookListenerIdGenerator = createUniqueIdGenerator$2('IdHook');
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
    const resolvedMapper = mapper ?? ((state) => state);
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
        currentLocale: internationalizationStore.state.currentLocale,
        defaultLocale: internationalizationStore.state.defaultLocale,
        locales: internationalizationStore.state.locales
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
        return (key, argsOrDefaultValue) => translator(`${translateUnitKey}.${key}`, argsOrDefaultValue);
    };
    const getId = () => ({
        key: translateUnitKey,
        context: internationalizationContext,
        locale: internationalizationStore.state.currentLocale
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

export { ConfigKeyContext, ConfigServiceImpl, ConfigStoreActions, bottle as Container, InternationalizationKeyContext, InternationalizationServiceImpl, InternationalizationStoreActions, JSXServiceImpl, LIGUI_TYPES, ModuleKeyContext, ModuleServiceImpl, ModuleStoreActions, RESET_SCOPE_ACTION, RESTORE_SCOPE_ACTION, RepositoryServiceImpl, ResourceKeyContext, ResourceServiceImpl, ResourceStoreActions, ScopeChangeEventType, ScopeMacroType, StoreChangeEventType, classes, createConfigHook, createConfigStore, createContext, createDependencyHook, createEventBus, createEventHook, createI18nHook, createInternationalizationStore, createModuleHook, createModuleStore, createNewLiguiInstance, createResourceHook, createResourceStore, createStateHook, createStore, createTranslatorHook, eventTrap, getEventBus, getState, getStore, isConfigsIdsEqual, isEventBusExist, isModifiedEvent, isModulesIdsEqual, isResourcesIdsEqual, isStoreExist, isTranslateUnitsIdsEqual, mergeRefs, setEventBusDevTool, setStoreDevTool, styles, useData, useId, useRef };
