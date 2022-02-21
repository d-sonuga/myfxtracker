declare const randomNumber: (min: number, max: number) => number;
declare const randomInt: (min: number, max: number) => number;
declare const mergeArrays: (...arrays: Array<Array<any>>) => any[];
declare const sum: (arr: Array<number>) => number;
declare const sumObjArray: (objs: {
    [key: string]: any;
}[], objKey: string) => number;
declare const cloneObj: (obj: {
    [key: string]: any;
}) => any;
export { randomNumber, mergeArrays, sum, sumObjArray, cloneObj, randomInt };
export * from './date-utils';
//# sourceMappingURL=index.d.ts.map