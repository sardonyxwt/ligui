# Core Lib

Core lib provide build in modules for app development. It include:

-   Module manager
-   I18n manager
-   Resource manager
-   Config manager
-   Dependency manager

### Module manager

Provides store for modules, service for module management and hooks for react components.

-   [service /src/service/module.service.ts](./src/service/module.service.ts)
-   [store /src/service/module.store.ts](./src/service/module.store.ts)
-   [hook /src/hook/module.hook.ts](./src/hook/module.hook.ts)

### Resource manager

Provides store for resources, service for resource management and hooks for react components.

-   [service /src/service/resource.service.ts](./src/service/resource.service.ts)
-   [store /src/service/resource.store.ts](./src/service/resource.store.ts)
-   [hook /src/hook/resource.hook.ts](./src/hook/resource.hook.ts)

### Config manager

Provides store for configs, service for config management and hooks for react components.

-   [service /src/service/config.service.ts](./src/service/config.service.ts)
-   [store /src/service/config.store.ts](./src/service/config.store.ts)
-   [hook /src/hook/config.hook.ts](./src/hook/config.hook.ts)

### I18n manager

Provides store for translation units and application localization state, service for localization management and hooks for react components.

-   [service /src/service/internationalization.service.ts](./src/service/internationalization.service.ts)
-   [store /src/service/internationalization.store.ts](./src/service/internationalization.store.ts)
-   [hook /src/hook/internationalization.hook.ts](./src/hook/internationalization.hook.ts)

## Used libs

-   [bottlejs] for dependency injection.
-   [@sardonyxwt/event-bus] for event management
-   [@sardonyxwt/state-store] for state management

[@sardonyxwt/event-bus]: https://www.npmjs.com/package/@sardonyxwt/event-bus
[@sardonyxwt/state-store]: https://www.npmjs.com/package/@sardonyxwt/state-store
[bottlejs]: https://www.npmjs.com/package/bottlejs

## Scripts

-   Install dependencies:

```sh
npm install
```

-   Build lib:

```sh
npm run build
```

-   Start development lib:

```sh
npm run watch
```

-   Run tests:

```sh
npm run test
```
