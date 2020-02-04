import { deleteFromArray, saveToArray } from '@sardonyxwt/utils/object';
import {
    InternationalizationStore,
    isTranslateUnitsIdsEqual,
    TranslateUnit,
    TranslateUnitData,
    TranslateUnitId
} from '../store/internationalization.store';

export type Translator = <T = string>(key: string, defaultValue?: T) => T;

export interface TranslateUnitLoader {
    readonly context?: string;
    readonly loader: (key: string, locale: string) => Promise<TranslateUnitData>;
}

export interface TranslateUnitPromise {
    readonly id: TranslateUnitId
    readonly promise: Promise<TranslateUnit>;
}

export interface InternationalizationService {
    registerTranslateUnitLoader(loader: TranslateUnitLoader): void;
    loadTranslateUnit(id: TranslateUnitId): Promise<TranslateUnit>;
    getTranslator(context: string, locale?: string): Translator;
}

export class InternationalizationServiceImpl implements InternationalizationService {

    private _translateUnitPromises: TranslateUnitPromise[] = [];

    constructor(protected _store: InternationalizationStore,
                protected _translateUnitLoaders: TranslateUnitLoader[] = []) {
    }

    registerTranslateUnitLoader(loader: TranslateUnitLoader) {
        deleteFromArray(this._translateUnitPromises, modulePromise => modulePromise.id.context === loader.context);
        saveToArray(this._translateUnitLoaders, loader, moduleLoader => moduleLoader.context === loader.context);
    }

    loadTranslateUnit(id: TranslateUnitId): Promise<TranslateUnit> {
        const {_translateUnitPromises, _translateUnitLoaders, _store} = this;

        const translateUnitPromise = _translateUnitPromises.find(it => isTranslateUnitsIdsEqual(id, it.id));

        if (translateUnitPromise) {
            return translateUnitPromise.promise;
        }

        if (_store.isTranslateUnitExist(id)) {
            const newTranslateUnitPromise: TranslateUnitPromise = {
                id, promise: Promise.resolve(_store.findTranslateUnitById(id))
            };
            _translateUnitPromises.push(newTranslateUnitPromise);
            return newTranslateUnitPromise.promise;
        }

        const translateUnitLoader = _translateUnitLoaders.find(loader => loader.context === id.context);

        if (!translateUnitLoader) {
            throw new Error(`TranslateUnit loader for key ${JSON.stringify(id)} not found`);
        }

        const newTranslateUnitPromise: TranslateUnitPromise = {
            id, promise: translateUnitLoader.loader(id.key, id.locale)
                .then(null, () => translateUnitLoader.loader(id.key, _store.defaultLocale))
                .then(translateUnitData => {
                    const translateUnit: TranslateUnit = {id, data: translateUnitData};
                    _store.setTranslateUnit(translateUnit);
                    return translateUnit;
                })
        };

        _translateUnitPromises.push(newTranslateUnitPromise);

        return newTranslateUnitPromise.promise;
    }

    getTranslator(context: string, locale?: string): Translator {
        return <T>(path: string, defaultValue?: T) => {
            if (typeof path !== 'string') {
                throw new Error(`Invalid translator arg path format ${path}`)
            }

            const [key, ...pathParts] = path.split(/[.\[\]]/).filter(it => it !== '');

            const translateUnitId: TranslateUnitId = {key, context, locale: locale || this._store.currentLocale};

            let result = this._store.findTranslateUnitById(translateUnitId);

            for (let i = 0; i < pathParts.length && !!result; i++) {
                result = result[pathParts[i]] as TranslateUnit;
            }

            if (result === undefined) {
                return defaultValue;
            }

            return result as unknown as T;
        };
    }

}
