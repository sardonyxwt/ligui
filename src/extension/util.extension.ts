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
      result = undefined;
      break;
    }
    result = result[pathParts[i]];
  }
  return result;
};
export const saveToArray = <T>(
  array: T[],
  newEl: T,
  compareFn: (arrEl: T, newEl: T, index: number, arr: T[]) => boolean = (arrEl, newEl) => arrEl === newEl
): void => {
  const oldElIndex = array.findIndex((arrEl, index, arr) => compareFn(arrEl, newEl, index, arr));
  if (oldElIndex === -1) {
    array.push(newEl);
    return;
  }
  array[oldElIndex] = newEl;
};
export const deleteFromArray = <T>(
  array: T[],
  compareFn: (arrEl: T, index: number, arr: T[]) => boolean
) => {
  const deleteElIndex = array.findIndex(compareFn);
  if (deleteElIndex === -1) {
    return;
  }
  array.splice(deleteElIndex, 1);
};
