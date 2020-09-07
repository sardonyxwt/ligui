/**
 * @function generateSalt
 * @description Generate string from symbols.
 * @param length generated string length.
 * @param sample symbols used to generation.
 * @returns {string}
 */
export const generateSalt = (
    length = 16,
    sample = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
): string => {
    let result = '';
    while (result.length < length) {
        result += sample.charAt(Math.floor(Math.random() * sample.length));
    }
    return result;
};

export type Generator = () => string;

/**
 * @function createUniqueIdGenerator
 * @description Create ids for prefix.
 * @param prefix Prefix used for unique id generation.
 * @returns {string}
 */
export const createUniqueIdGenerator = (prefix: string): Generator => {
    let index = 0;
    return () => `${prefix}:${++index}`;
};
