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
    readonly loader: (key: string, locale: string) => TranslateUnitData | Promise<TranslateUnitData>;
}

export interface TranslateUnitPromise {
    readonly id: TranslateUnitId
    readonly promise: Promise<TranslateUnit>;
}

export interface InternationalizationService {
    setTranslateUnitLoader(loader: TranslateUnitLoader): void;
    getTranslateUnitLoader(context?: string): TranslateUnitLoader;

    loadTranslateUnit(id: TranslateUnitId): TranslateUnit | Promise<TranslateUnit>;
    getTranslator(context: string, locale?: string): Translator;
}

export class InternationalizationServiceImpl implements InternationalizationService {

    private _translateUnitPromises: TranslateUnitPromise[] = [];

    constructor(protected _store: InternationalizationStore,
                protected _translateUnitLoaders: TranslateUnitLoader[] = []) {
    }

    setTranslateUnitLoader(loader: TranslateUnitLoader): void {
        deleteFromArray(this._translateUnitPromises, translateUnitPromise => translateUnitPromise.id.context === loader.context);
        saveToArray(this._translateUnitLoaders, loader, translateUnitLoader => translateUnitLoader.context === loader.context);
    }

    getTranslateUnitLoader(context?: string): TranslateUnitLoader {
        return this._translateUnitLoaders.find(loader => loader.context === context);
    }

    loadTranslateUnit(id: TranslateUnitId): TranslateUnit | Promise<TranslateUnit> {
        const {_translateUnitPromises, _translateUnitLoaders, _store} = this;

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

        const translateUnitData = translateUnitLoader.loader(id.key, id.locale) ?? translateUnitLoader.loader(id.key, _store.defaultLocale);

        const resolveTranslateUnit = (translateUnitData: TranslateUnitData): TranslateUnit => {
            const translateUnit: TranslateUnit = {id, data: translateUnitData};
            _store.setTranslateUnit(translateUnit);
            return translateUnit;
        };

        if (translateUnitData instanceof Promise) {
            const newTranslateUnitPromise: TranslateUnitPromise = {
                id, promise: translateUnitData.then(resolveTranslateUnit)
            };

            newTranslateUnitPromise.promise.then(() => deleteFromArray(
                this._translateUnitPromises,
                translateUnitPromise => isTranslateUnitsIdsEqual(translateUnitPromise.id, id)
            ));

            _translateUnitPromises.push(newTranslateUnitPromise);
            return newTranslateUnitPromise.promise;
        }

        return resolveTranslateUnit(translateUnitData);
    }

    getTranslator(context: string, locale?: string): Translator {
        return <T>(path: string, defaultValue?: T) => {
            if (typeof path !== 'string') {
                throw new Error(`Invalid translator arg path format ${path}`)
            }

            const [key, ...pathParts] = path.split(/[.\[\]]/).filter(it => it !== '');

            const translateUnitId: TranslateUnitId = {key, context, locale: locale || this._store.currentLocale};
            const defaultTranslateUnitId: TranslateUnitId = {key, context, locale: this._store.defaultLocale};

            let translateUnit = this._store.findTranslateUnitById(translateUnitId)
                ?? this._store.findTranslateUnitById(defaultTranslateUnitId);

            if (translateUnit === undefined) {
                return defaultValue;
            }

            let result = translateUnit.data;

            for (let i = 0; i < pathParts.length && !!result; i++) {
                result = result[pathParts[i]] as TranslateUnitData;
            }

            // Support JSON.parse \n and \t
            if (typeof result === 'string') {
                return (result as string)
                    .replace('$\\n', '\n')
                    .replace('$\\t', '\t') as unknown as T;
            }

            if (result === undefined) {
                return defaultValue;
            }

            return result as unknown as T;
        };
    }

}
