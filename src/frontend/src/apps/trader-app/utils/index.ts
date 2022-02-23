import {cloneDeep} from 'lodash'

/**
 * To turn raw money calculations to a presentable format
 * If money is negative, it should output money in
 * 2dp with a currency symbol in front, like -$45
 * If its positive, it should output it in 2dp with a currency symbol
 * in front, like $34
 */
const formatMoney = (amount: number): string => {
    if(amount < 0){
        return `-$${to2dp(amount * -1)}`
    } else {
        return `$${to2dp(amount)}`
    }
}

const formatPercent = (num: number) => {
    return `${to2dp(num)}%`;
}

const to2dpstring = (num: number) => {
    return num.toFixed(2);
}

const to2dp = (num: number) => {
    return parseFloat(num.toFixed(2));
}

const objArrayTo2dp = <T extends {[key: string]: any}>(objArray: T[], objArrayKey: keyof T): T[] => {
    return objArray.map((obj) => (
        {...obj, [objArrayKey]: to2dp(obj[objArrayKey])}
    ));
}

const objObjArrayTo2dp = <T extends {[key: string]: any}>(data: T, objKey: keyof T[keyof T][number]): T => {
    const data2dp: T = cloneDeep(data);
    Object.keys(data).forEach((skey) => {
        const key = skey as keyof T;
        data2dp[key] = objArrayTo2dp<T[keyof T]>(data[key], objKey) as T[keyof T];
    })
    return data2dp;
}

export {
    formatMoney,
    to2dp,
    to2dpstring,
    formatPercent,
    objArrayTo2dp,
    objObjArrayTo2dp
}