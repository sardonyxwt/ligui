// ToDo refactoring

export type Builder<T> = {
  set: <K extends keyof T>(key: K, value: T[K]) => Builder<T>;
  setFrom: (data: Partial<T>) => Builder<T>;
  build: () => T;
} & {
  [K in keyof T]: (value: T[K]) => Builder<T>;
}

export type BuilderProps<T = {}> = Partial<{
  [K in keyof T]: ((entity: T) => T[K]) | T[K]
}>

export type BuilderFactory = <T>(clazz: new (...args) => T, initProps?: BuilderProps<T>) => () => Builder<T>
export type Mapping = string | ((source) => any) | [string | ((source) => any), MappingResolver<any>];
export type MappingDecorator = (mapping?: Mapping, defaultValue?) => PropertyDecorator;
export type MappingDecoratorFactory = (sourceId?: string) => MappingDecorator;
export interface MappingResolver<T> {
  from: (source: any) => T;
  fromArray: (source: any) => T[];
}
export type MappingResolverFactory = <T>(clazz: new (...args) => T, sourceId?: string) => MappingResolver<T>;

function createBuilder<T>(clazz: new (...args) => T, defaultParams: BuilderProps<T> = {}): Builder<T> {
  const tempObj = Object.create({});

  const builder = new Proxy({
    set: (key, value) => {
      tempObj[key] = value;
      return builder;
    },
    setFrom: (data) => {
      if (typeof data === 'object') {
        Object.getOwnPropertyNames(data).forEach(key => tempObj[key] = data[key]);
      }
      return builder;
    },
    build: () =>  {
      const object = new (clazz as any)();
      Object.getOwnPropertyNames(tempObj).forEach(key => object[key] = tempObj[key]);
      Object.getOwnPropertyNames(defaultParams).forEach(key => {
        if (object[key] !== undefined) {
          return;
        }
        const defaultPropertyValue = defaultParams[key];
        if (typeof defaultPropertyValue === 'function') {
          object[key] = defaultPropertyValue(object);
        } else {
          object[key] = defaultPropertyValue;
        }
      });
      return object;
    }
  }, {
    get(target, key) {
      return key in target
        ? target[key]
        : (value) => target.set(key, value)
    }
  });

  return builder as Builder<T>;
}

export const clone = <T>(source: T): T => Object.assign( Object.create( Object.getPrototypeOf(source)), source);
export const cloneArray = <T>(sources: T[]): T[] => sources.map(clone);
export const cloneArrays = <T>(...sourceArrays: (T[])[]): T[] => {
  const result = [];
  sourceArrays.forEach(sourceArray =>
    sourceArray.forEach(source => result.push(clone(source))));
  return result;
};
export const copyArray = <T>(sources: T[]): T[] => [...sources];
export const copyArrays = <T>(...sourceArrays: (T[])[]): T[] => {
  const result = [];
  sourceArrays.forEach(sourceArray => result.push(...sourceArray));
  return result;
};
export const resolveArray = <T>(source: T | T[]): T[] => Array.isArray(source) ? source : [source];
export const arrayFrom = <T>(...sources: (T | T[])[]): T[] => copyArrays(...sources.map(resolveArray));

export const resolveValue = (object, path: string) => {
  const pathParts = path.split(/[.\[\]]/).filter(it => it !== '');
  let result = object;
  for (let i = 0; i < pathParts.length; i++) {
    if (!result || typeof result !== 'object') {
      result = null;
      break;
    }
    result = result[pathParts[i]];
  }
  return result;
};

export const builderFactory: BuilderFactory = <T> (clazz: new (...args) => T, initProps?: BuilderProps<T>) =>
  () => createBuilder<T>(clazz, initProps);

export const MAPPING_METADATA_KEY = 'metadata:mapping';
export const MAPPING_DEFAULT_SOURCE_ID = 'default';

const metaKey = (sourceId?: string) => `${MAPPING_METADATA_KEY}:${sourceId || MAPPING_DEFAULT_SOURCE_ID}`;

export const mappingDecoratorFactory: MappingDecoratorFactory = (sourceId?) => {
  return (mapping?: Mapping, defaultValue = null) => {
    return (target: Object, propertyKey: string | symbol) => {
      const metadataKey = metaKey(sourceId);
      const isPropertyMetadataExist = Reflect.hasMetadata(metadataKey, target);
      let properties = isPropertyMetadataExist ? Reflect.getMetadata(metadataKey, target) : [];
      properties.push(propertyKey);
      Reflect.defineMetadata(metadataKey, properties, target);
      Reflect.defineMetadata(metadataKey, [mapping, defaultValue], target, propertyKey);
    }
  }
};

export const mapping = mappingDecoratorFactory();

export const mappingResolverFactory: MappingResolverFactory =
  <T>(clazz: new (...args) => T, sourceId?: string): MappingResolver<T> => {
  const from = (source: any) => {
    if (typeof source !== 'object' || Array.isArray(source)) {
      return null;
    }


    const resolveMapping = (propertyName, mapping: Mapping, defaultValue) => {
      if (typeof mapping === 'string') {
        return resolveValue(source, mapping) || defaultValue;
      } else if (typeof mapping === 'function') {
        return mapping(source) || defaultValue;
      }
      return source[propertyName] || defaultValue;
    };

    const metadataKey = metaKey(sourceId);
    const isPropertyMetadataExist = Reflect.hasMetadata(metadataKey, clazz.prototype);

    if (!isPropertyMetadataExist) {
      throw new Error('Property metadata not exist')
    }

    const builder = createBuilder(clazz);

    Reflect.getMetadata(metadataKey, clazz.prototype).map(propertyName => {
      const hasMetadata = Reflect.hasMetadata(metaKey(sourceId), clazz.prototype, propertyName);
      if (hasMetadata) {
        const [mapping, defaultValue]: [Mapping, any]
          = Reflect.getMetadata(metaKey(sourceId), clazz.prototype, propertyName);
        if (Array.isArray(mapping)) {
          const value = resolveMapping(propertyName, mapping[0], defaultValue);
          if (Array.isArray(value)) {
            builder[propertyName](mapping[1].fromArray(value));
          } else {
            builder[propertyName](mapping[1].from(value));
          }
        } else {
          builder[propertyName](resolveMapping(propertyName, mapping, defaultValue));
        }
      }
    });

    return builder.build() as T;
  };
  const fromArray = (source: any[]) => {
    if (typeof source !== 'object' || !Array.isArray(source)) {
      return null;
    }
    return source.map(from);
  };
  return {from, fromArray};
};

export const MAPPING: {
  date: MappingResolver<Date>;
  split: (separator: string | RegExp, limit?: number) => MappingResolver<string>;
} = {
  date: {
    from: source => source ? new Date(source) : null,
    fromArray: source => source ? source.map(MAPPING.date.from) : null
  },
  split: (separator: string | RegExp, limit?: number) => ({
    from: source => source ? source.split(separator, limit) : null,
    fromArray: source => source ? source.map(MAPPING.split(separator, limit).from) : null
  })
};
