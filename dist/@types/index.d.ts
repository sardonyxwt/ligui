import * as SynchronizedUtils from '@sardonyxwt/utils/synchronized';
import * as GeneratorUtils from '@sardonyxwt/utils/generator';
import * as ObjectUtils from '@sardonyxwt/utils/object';
import * as FileUtils from '@sardonyxwt/utils/file';
import * as JsonUtils from '@sardonyxwt/utils/json';
import * as Store from '@sardonyxwt/state-store';
import { JSXService } from './service/jsx.service';
import { RestService } from './service/rest.service';
import { ConfigService } from './service/config.service';
import { RouterService } from './service/router.service';
import { ResourceService } from './service/resource.service';
import { LocalizationService } from './service/localization.service';
export { h, Component, AnyComponent, FunctionalComponent, ComponentConstructor } from 'preact';
export { SynchronizedUtils, GeneratorUtils, ObjectUtils, FileUtils, JsonUtils, Store, JSXService, RestService, ConfigService, RouterService, ResourceService, LocalizationService };
export declare namespace ligui {
    const jsx: JSXService;
    const rest: RestService;
    const config: ConfigService;
    const router: RouterService;
    const resources: ResourceService;
    const localization: LocalizationService;
    const store: typeof Store;
    const utils: {
        synchronized: typeof SynchronizedUtils;
        generator: typeof GeneratorUtils;
        object: typeof ObjectUtils;
        file: typeof FileUtils;
        json: typeof JsonUtils;
    };
}
