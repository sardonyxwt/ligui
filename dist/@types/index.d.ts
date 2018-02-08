import * as SynchronizedUtils from '@sardonyxwt/utils/synchronized';
import * as GeneratorUtils from '@sardonyxwt/utils/generator';
import * as ObjectUtils from '@sardonyxwt/utils/object';
import * as FileUtils from '@sardonyxwt/utils/file';
import * as JsonUtils from '@sardonyxwt/utils/json';
import { JSXService } from './service/jsx.service';
import { RestService } from './service/rest.service';
import { StoreService } from './service/store.service';
import { LocalizationProvider, ILocalizationService } from './provider/impl/localization.provider';
import { ResourceProvider, IResourceService } from './provider/impl/resource.provider';
import { RouterProvider, IRouterService } from './provider/impl/router.provider';
import { ConfigProvider, IConfigService } from './provider/impl/config.provider';
export declare const ligui: Readonly<{
    jsx: JSXService;
    rest: RestService;
    store: StoreService;
    readonly localization: ILocalizationService;
    readonly resource: IResourceService;
    readonly router: IRouterService;
    readonly config: IConfigService;
    localizationProvider: LocalizationProvider;
    resourceProvider: ResourceProvider;
    routerProvider: RouterProvider;
    configProvider: ConfigProvider;
    utils: Readonly<{
        synchronized: typeof SynchronizedUtils;
        generator: typeof GeneratorUtils;
        object: typeof ObjectUtils;
        file: typeof FileUtils;
        json: typeof JsonUtils;
    }>;
}>;
