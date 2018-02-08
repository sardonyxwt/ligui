import * as SynchronizedUtils from '@sardonyxwt/utils/synchronized';
import * as GeneratorUtils from '@sardonyxwt/utils/generator';
import * as ObjectUtils from '@sardonyxwt/utils/object';
import * as FileUtils from '@sardonyxwt/utils/file';
import * as JsonUtils from '@sardonyxwt/utils/json';
import { JSXService } from './service/jsx.service';
import { RestService } from './service/rest.service';
import { StoreService } from './service/store.service';
import { ILocalizationService, ILocalizationProviderConfig } from './provider/impl/localization.provider';
import { IResourceService, IResourceProviderConfig } from './provider/impl/resource.provider';
import { IRouterService, IRouterProviderConfig } from './provider/impl/router.provider';
import { IConfigService, IConfigProviderConfig } from './provider/impl/config.provider';
declare const ligui: Readonly<{
    readonly localization: ILocalizationService;
    readonly resource: IResourceService;
    readonly router: IRouterService;
    readonly config: IConfigService;
    configure(config: {
        localization: ILocalizationProviderConfig;
        resource: IResourceProviderConfig;
        router: IRouterProviderConfig;
        config: IConfigProviderConfig;
    }): void;
    jsx: JSXService;
    rest: RestService;
    store: StoreService;
    utils: Readonly<{
        synchronized: typeof SynchronizedUtils;
        generator: typeof GeneratorUtils;
        object: typeof ObjectUtils;
        file: typeof FileUtils;
        json: typeof JsonUtils;
    }>;
}>;
export default ligui;
