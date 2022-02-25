const randomNumber = (min: number, max: number) => {
    return (Math.random() * (max - min)) + min
}

const randomInt = (min: number, max: number) => {
    return Math.round(randomNumber(min, max));
}

const mergeArrays = (...arrays: Array<Array<any>>) => {
    let newArray: any[] = [];
    for(const array of arrays){
        newArray = [...newArray, ...array];
    }
    return newArray
}

const sum = (arr: Array<number>) => {
    let sum = 0;
    for(const i in arr){
        sum += arr[i];
    }
    return sum;
}

const sumObjArray = (objs: Array<{[key: string]: any}>, objKey: string) => {
    return sum(objs.map((obj) => obj[objKey]))
}

const cloneObj = (obj: {[key: string]: any}) => {
    return JSON.parse(JSON.stringify(obj));
}

const approximate = (n: number): number => {
    return parseFloat(n.toFixed(10));
}


export {
    randomNumber,
    mergeArrays,
    sum,
    sumObjArray,
    cloneObj,
    randomInt,
    approximate
}

export * from './date-utils'