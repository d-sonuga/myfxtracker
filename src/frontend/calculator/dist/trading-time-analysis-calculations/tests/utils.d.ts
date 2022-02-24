declare const randomTime: () => string;
declare const randomDate: () => string;
/**
 *
 * @param arrayToOrder array of objects which are considered to be out of order
 * @param orderedArray array of objects which are considered to be in order with respect to their anchor keys
 * @param anchorKey the key which is used for the ordering
 * @returns the arrayToOrder in order
 */
declare const putInSameOrder: <T>(arrayToOrder: T[], orderedArray: T[], anchorKey: keyof T) => T[];
export { randomTime, randomDate, putInSameOrder };
//# sourceMappingURL=utils.d.ts.map