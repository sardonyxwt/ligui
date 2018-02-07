import * as SynchronizedUtils from '@sardonyxwt/utils/synchronized';
import * as GeneratorUtils from '@sardonyxwt/utils/generator';
import * as ObjectUtils from '@sardonyxwt/utils/object';
import * as FileUtils from '@sardonyxwt/utils/file';
import * as JsonUtils from '@sardonyxwt/utils/json';
import { JSXService } from './service/jsx.service';
import { RestService } from './service/rest.service';
import { StoreService } from './service/store.service';
import { ILocalizationService } from './provider/impl/localization.provider';
import { IResourceService } from './provider/impl/resource.provider';
import { IRouterService } from './provider/impl/router.provider';
import { IConfigService } from './provider/impl/config.provider';
export declare class Ligui {
    static readonly jsx: JSXService;
    static readonly rest: RestService;
    static readonly store: StoreService;
    static readonly localization: ILocalizationService;
    static readonly resource: IResourceService;
    static readonly router: IRouterService;
    static readonly config: IConfigService;
    static readonly utils: Readonly<{
        synchronized: typeof SynchronizedUtils;
        generator: typeof GeneratorUtils;
        object: typeof ObjectUtils;
        file: typeof FileUtils;
        json: typeof JsonUtils;
    }>;
}
