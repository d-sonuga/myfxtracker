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
    return to2dp(num).toString();
}

const to2dp = (num: number) => {
    return parseFloat(num.toFixed(2));
}

export {
    formatMoney,
    to2dp,
    to2dpstring,
    formatPercent
}