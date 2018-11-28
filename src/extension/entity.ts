export type Builder<T, D = T> = {
  set: <K extends keyof D>(key: K, value: D[K]) => Builder<T, D>;
  setFrom: (data: Partial<D>) => Builder<T, D>;
  build: () => T;
} & {
  [K in keyof D]: (value: D[K]) => Builder<T, D>;
}

export interface EntityHelper<T, D = T>  {
  builder?: (initProps?: Partial<D>) => Builder<T, D>;
  clone?: (source: T) => T;
  cloneArray?: (sources: T[]) => T[];
  cloneArrays?: (...sources: (T[])[]) => T[];
  copyArray?: (sources: T[]) => T[];
  copyArrays?: (...sources: (T[])[]) => T[];
  resolveArray?: (source: T | T[]) => T[];
  arrayFrom?: (...sources: (T | T[])[]) => T[];
}

function createBuilder(constructor, defaultParams = {}) {
  const tempObj = Object.assign({}, defaultParams);

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
      const object = new constructor();
      Object.getOwnPropertyNames(tempObj).forEach(key => object[key] = tempObj[key]);
      return object;
    }
  }, {
    get(target, key) {
      return key in target
        ? target[key]
        : (value) => target.set(key, value)
    }
  });

  return builder;
}

export const entity =
  <T extends {}>(props: {
    defaultProps?: Partial<T>;
  } = {}) => <C extends new (...args: any[]) => any>(constructor: C) => {

    const builder = (initProps?) => createBuilder(constructor, props.defaultProps || initProps);
    const clone = (source: C) => Object.assign( Object.create( Object.getPrototypeOf(source)), source);
    const cloneArray = (sources: C[]) => sources.map(clone);
    const cloneArrays = (...sourceArrays: (C[])[]) => {
      const result = [];
      sourceArrays.forEach(sourceArray =>
        sourceArray.forEach(source => result.push(clone(source))));
      return result;
    };
    const copyArray = (sources: C[]) => [...sources];
    const copyArrays = (...sourceArrays: (C[])[]) => {
      const result = [];
      sourceArrays.forEach(sourceArray => result.push(...sourceArray));
      return result;
    };
    const resolveArray = (source: C | C[]) => Array.isArray(source) ? source : [source];
    const arrayFrom = (...sources: (C | C[])[]) => copyArrays(...sources.map(resolveArray));

    constructor['$'] = {
      builder,
      clone,
      cloneArray,
      cloneArrays,
      copyArray,
      copyArrays,
      resolveArray,
      arrayFrom
    } as EntityHelper<C, T>;

    return constructor as C & {
      $: EntityHelper<C, T>
    };
  };
