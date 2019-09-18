import { ScopeListener, ScopeListenerUnsubscribeCallback } from '@sardonyxwt/state-store';
import {
    InternationalizationScope,
    InternationalizationScopeExtensions,
    InternationalizationScopeState,
    TranslateUnit,
    TranslateUnitData,
    TranslateUnitId,
    translateUnitIdComparator
} from '../scope/internationalization.scope';
import { deleteFromArray, saveToArray } from '@sardonyxwt/utils/object';

export type Translator = <T = string>(key: string) => T;

export interface TranslateUnitDataLoader {
    readonly context?: string;
    readonly loader: (key: string, locale: string) => Promise<TranslateUnitData>;
}

export interface TranslateUnitDataPromise {
    readonly id: TranslateUnitId
    readonly promise: Promise<any>;
}

export interface InternationalizationService extends InternationalizationScopeExtensions {
    getTranslator(context: string, locale?: string): Translator;

    registerTranslateUnitDataLoader<T>(loader: TranslateUnitDataLoader): void;

    loadTranslateUnitData(id: TranslateUnitId): Promise<TranslateUnitData>;
}

export class InternationalizationServiceImpl implements InternationalizationService {

    private _translateUnitPromises: TranslateUnitDataPromise[] = [];

    constructor(protected _scope: InternationalizationScope,
                protected _translateUnitLoaders: TranslateUnitDataLoader[] = []) {
    }

    get currentLocale() {
        return this._scope.currentLocale;
    };

    get defaultLocale() {
        return this._scope.defaultLocale;
    }

    get locales() {
        return this._scope.locales;
    };

    get translateUnits() {
        return this._scope.translateUnits;
    };

    registerTranslateUnitDataLoader<T>(loader: TranslateUnitDataLoader) {
        deleteFromArray(this._translateUnitPromises, modulePromise => modulePromise.id.context === loader.context);
        saveToArray(this._translateUnitLoaders, loader, moduleLoader => moduleLoader.context === loader.context);
    }

    setLocale(locale: string): void {
        this._scope.setLocale(locale);
    }

    setTranslateUnit(translateUnit: TranslateUnit): void {
        this._scope.setTranslateUnit(translateUnit);
    }

    getTranslateUnitData(id: TranslateUnitId): TranslateUnitData {
        return this._scope.getTranslateUnitData(id);
    }

    getTranslator(context: string, locale?: string): Translator {
        return <T>(path: string) => {
            if (typeof path !== 'string') {
                throw new Error(`Invalid translator arg path format ${path}`)
            }

            const [key, ...pathParts] = path.split(/[.\[\]]/).filter(it => it !== '');

            const translateUnitId: TranslateUnitId = {key, context, locale: locale || this.currentLocale};

            let result = this.getTranslateUnitData(translateUnitId);

            for (let i = 0; i < pathParts.length && !!result; i++) {
                result = result[pathParts[i]] as TranslateUnitData;
            }

            return result as unknown as T;
        };
    }

    onSetLocale(listener: ScopeListener<InternationalizationScopeState>): ScopeListenerUnsubscribeCallback {
        return this._scope.onSetLocale(listener);
    }

    onSetTranslateUnit(listener: ScopeListener<InternationalizationScopeState>): ScopeListenerUnsubscribeCallback {
        return this._scope.onSetTranslateUnit(listener);
    }

    isTranslateUnitLoaded(id: TranslateUnitId): boolean {
        return this._scope.isTranslateUnitLoaded(id);
    }

    loadTranslateUnitData(id: TranslateUnitId): Promise<TranslateUnitData> {
        const {_translateUnitPromises, _translateUnitLoaders, _scope} = this;
        const {defaultLocale, setTranslateUnit, getTranslateUnitData} = _scope;

        const translateUnitPromise = _translateUnitPromises.find(it => translateUnitIdComparator(id, it.id));

        if (translateUnitPromise) {
            return translateUnitPromise.promise;
        }

        const translateUnitData = getTranslateUnitData(id);

        if (translateUnitData) {
            const newTranslateUnitDataPromise: TranslateUnitDataPromise = {
                id, promise: Promise.resolve(translateUnitData)
            };
            _translateUnitPromises.push(newTranslateUnitDataPromise);
            return newTranslateUnitDataPromise.promise;
        }

        const translateUnitLoader = _translateUnitLoaders.find(it => it.context === id.context);

        if (!translateUnitLoader) {
            throw new Error(`TranslateUnitData loader for key ${JSON.stringify(id)} not found`);
        }

        const newTranslateUnitDataPromise: TranslateUnitDataPromise = {
            id, promise: translateUnitLoader.loader(id.key, id.locale)
                .then(null, () => translateUnitLoader.loader(id.key, defaultLocale))
                .then(translateUnitData => {
                    setTranslateUnit({id, data: translateUnitData});
                    return translateUnitData;
                })
        };

        _translateUnitPromises.push(newTranslateUnitDataPromise);

        return newTranslateUnitDataPromise.promise;
    }

}
