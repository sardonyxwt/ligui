import { deleteFromArray, saveToArray } from '@source/util/object.utils';
import {
    InternationalizationStore,
    isTranslateUnitsIdsEqual,
    TranslateUnit,
    TranslateUnitData,
    TranslateUnitId,
} from '@source/store/internationalization.store';

/**
 * @interface TranslatorArgs
 * @description Args for translator.
 * Contains of defaultValue and args for insert in translated string template.
 */
export interface TranslatorArgs<T> {
    defaultValue?: T;
    [key: string]: unknown;
}

/**
 * @type Translator
 * @description Translator used for app localization.
 */
export interface Translator {
    /**
     * @method
     * @description Return translated value.
     * @param path {string | Record<string, unknown>}
     * path for localization:
     * @example "footer.links.social.facebook"
     * or localization map:
     * @example "{'ru': 'Привет мир', 'en': 'Hello world'}"
     * @param argsOrDefaultValue {T | TranslatorArgs<T>}
     * Default value if translator return undefined
     * or map for replace in translate template with default value.
     * @example "Hello ${name}!" with {name: 'World'} -> "Hello World!"
     */
    <T = string>(
        path: string | Record<string, unknown>,
        argsOrDefaultValue?: T | TranslatorArgs<T>,
    ): T;

    /**
     * @field locale
     * @description Locale of translator.
     */
    locale: string;

    /**
     * @field prefix
     * @description Prefix of all translation calls.
     */
    prefix: string;
}

/**
 * @interface TranslateUnitLoader
 * @description Loader for translation units from any context.
 */
export interface TranslateUnitLoader {
    readonly context?: string;
    readonly bindingContext?: string;
    readonly loader?: (
        locale: string,
        key: string,
        context: string,
    ) => TranslateUnitData | Promise<TranslateUnitData>;
}

interface TranslateUnitPromise {
    readonly id: TranslateUnitId;
    readonly promise: Promise<TranslateUnit>;
}

/**
 * @interface ConfigService
 * @description Service manage i18n store and used for translation.
 */
export interface InternationalizationService {
    /**
     * @method setTranslateUnitLoader
     * @description Add or replace exist translate unit loader.
     * @param loader {TranslateUnitLoader} Loader for replaced or added.
     */
    setTranslateUnitLoader(loader: TranslateUnitLoader): void;

    /**
     * @method getTranslateUnitLoader
     * @description Return translation unit loader with same context.
     * @param context {string} Context for loader.
     * @returns {TranslateUnitLoader}
     */
    getTranslateUnitLoader(context?: string): TranslateUnitLoader;

    /**
     * @method loadTranslateUnit
     * @description Load translate unit used loader.
     * @param id {TranslateUnitId} for loader.
     * @returns {TranslateUnit | Promise<TranslateUnit>}
     */
    loadTranslateUnit(
        id: TranslateUnitId,
    ): TranslateUnit | Promise<TranslateUnit>;

    /**
     * @method getTranslator
     * @description Return translator if translate unit present in store.
     * @param context Context of translation.
     * @param locale Locale used for translation.
     * @returns {Translator}
     */
    getTranslator(context: string, locale?: string): Translator;
}

/**
 * @class InternationalizationServiceImpl
 * @description Default realization of InternationalizationService.
 * You can replace it after core instance created.
 */
export class InternationalizationServiceImpl
    implements InternationalizationService {
    private _translateUnitPromises: TranslateUnitPromise[] = [];

    constructor(
        protected _store: InternationalizationStore,
        protected _translateUnitLoaders: TranslateUnitLoader[] = [],
    ) {}

    setTranslateUnitLoader(loader: TranslateUnitLoader): void {
        if (!!loader.loader === !!loader.bindingContext) {
            throw new Error('You need set loader or bindingContext');
        }
        deleteFromArray(
            this._translateUnitPromises,
            (translateUnitPromise) =>
                translateUnitPromise.id.context === loader.context,
        );
        saveToArray(
            this._translateUnitLoaders,
            loader,
            (translateUnitLoader) =>
                translateUnitLoader.context === loader.context,
        );
    }

    getTranslateUnitLoader(context?: string): TranslateUnitLoader {
        const loader = this._translateUnitLoaders.find(
            (loader) => loader.context === context,
        );
        if (loader.bindingContext) {
            return this.getTranslateUnitLoader(loader.bindingContext);
        }
        return loader;
    }

    loadTranslateUnit(
        id: TranslateUnitId,
    ): TranslateUnit | Promise<TranslateUnit> {
        const { _translateUnitPromises, _store } = this;

        if (_store.isTranslateUnitExist(id)) {
            return _store.findTranslateUnitById(id);
        }

        const translateUnitPromise = _translateUnitPromises.find((it) =>
            isTranslateUnitsIdsEqual(id, it.id),
        );

        if (translateUnitPromise) {
            return translateUnitPromise.promise;
        }

        const translateUnitLoader = this.getTranslateUnitLoader(id.context);

        if (!translateUnitLoader) {
            throw new Error(
                `TranslateUnit loader for key ${JSON.stringify(id)} not found`,
            );
        }

        const translateUnitData =
            translateUnitLoader.loader(id.locale, id.key, id.context) ??
            translateUnitLoader.loader(
                _store.getDefaultLocale(),
                id.key,
                id.context,
            );

        const resolveTranslateUnit = (
            translateUnitData: TranslateUnitData,
        ): TranslateUnit => {
            const translateUnit: TranslateUnit = {
                id,
                data: translateUnitData,
            };
            _store.setTranslateUnits([translateUnit]);
            return translateUnit;
        };

        if (translateUnitData instanceof Promise) {
            const newTranslateUnitPromise: TranslateUnitPromise = {
                id,
                promise: translateUnitData.then(resolveTranslateUnit),
            };

            newTranslateUnitPromise.promise.then(() =>
                deleteFromArray(
                    this._translateUnitPromises,
                    (translateUnitPromise) =>
                        isTranslateUnitsIdsEqual(translateUnitPromise.id, id),
                ),
            );

            _translateUnitPromises.push(newTranslateUnitPromise);
            return newTranslateUnitPromise.promise;
        }

        return resolveTranslateUnit(translateUnitData);
    }

    getTranslator(context: string, locale?: string): Translator {
        const translator: Translator = <T>(
            path: string | Record<string, unknown>,
            argsOrDefaultValue?: T | TranslatorArgs<T>,
        ): T => {
            let resolvedArgs: TranslatorArgs<T> = {};

            if (typeof argsOrDefaultValue === 'string') {
                resolvedArgs = { defaultValue: argsOrDefaultValue };
            } else if (typeof argsOrDefaultValue === 'object') {
                resolvedArgs = argsOrDefaultValue as TranslatorArgs<T>;
            }

            if (typeof path === 'object') {
                return (
                    (path[translator.locale] as T) || resolvedArgs.defaultValue
                );
            }

            if (typeof path !== 'string') {
                throw new Error(`Invalid translator arg path format ${path}`);
            }

            const resolvedPath = `${translator.prefix}${path}`;

            const [key, ...pathParts] = resolvedPath
                .split(/[.\[\]]/)
                .filter((it) => it !== '');

            const translateUnitId: TranslateUnitId = {
                key,
                context,
                locale: locale || this._store.getCurrentLocale(),
            };
            const defaultTranslateUnitId: TranslateUnitId = {
                key,
                context,
                locale: this._store.getDefaultLocale(),
            };

            const translateUnit =
                this._store.findTranslateUnitById(translateUnitId) ??
                this._store.findTranslateUnitById(defaultTranslateUnitId);

            if (translateUnit === undefined) {
                return resolvedArgs.defaultValue;
            }

            let result: string | TranslateUnitData = translateUnit.data;

            for (let i = 0; i < pathParts.length && !!result; i++) {
                result = result[pathParts[i]] as TranslateUnitData;
            }

            if (result === undefined) {
                return resolvedArgs.defaultValue;
            }

            if (typeof result !== 'string') {
                return (result as unknown) as T;
            }

            Object.keys(resolvedArgs).forEach((argKey) => {
                const templateArgument = resolvedArgs[argKey] ?? '';
                result = (result as string).replace(
                    `\${${argKey}}`,
                    typeof templateArgument === 'string'
                        ? templateArgument
                        : JSON.stringify(templateArgument),
                );
            });

            return result;
        };

        translator.locale = locale || this._store.getCurrentLocale();
        translator.prefix = '';

        return translator;
    }
}
