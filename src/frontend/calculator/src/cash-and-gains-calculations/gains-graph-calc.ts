import {Trade} from '@root/types'
import {cloneObj, sameDay, sameMonth, sameWeek, sameYear, approximate} from '@root/utils'
import {AccountData} from '..'
import { balanceCalc } from './common-calc'
import {GainsGraphCalc, GainsGraphItem} from './types'

/**
 * Gains graph is a graph of cummulative gains percentages against tradeNo
 * gainsPercent is defined as profitLoss / totalDeposits
 * Each item in the object is an array of objects
 * with keys tradeNo and gainsPercent.
 * tradeNo is the index of a trade in a chronologically ordered
 * array of trades. For example, if trade A is the first trade a user
 * ever made and trade B was made after it, then trade A will have a tradeNo
 * of 0 and trade B will have a tradeNo of 1
 * The gainsPercent is the cummulative profit / loss of that trade.
 * That is the gainsPercent is the addition of all the profit profit / losses up to
 * the one with the current tradeNo divided by all the deposits up to the last deposit that happened
 * on or before the trade with the current tradeNo took place
 * Each field in the calculations object shows different views over the
 * same data, which correspond to different time ranges:
 * today, this week, this month, this year and all time
 */
const gainsGraphCalc = (accountData: AccountData, today: Date = new Date()) => {
    const calculations: GainsGraphCalc = {
        todayGraphCalc: todayGainsPercent(accountData, today),
        thisWeekGraphCalc: thisWeekGainsPercent(accountData, today),
        thisMonthGraphCalc: thisMonthGainsPercent(accountData, today),
        thisYearGraphCalc: thisYearGainsPercent(accountData, today),
        allTimeGraphCalc: allTimeGainsPercent(accountData)
    }
    return calculations;
}

const todayGainsPercent = (accountData: AccountData, today: Date) => {
    const accData: AccountData = cloneObj(accountData);
    accData.trades = accData.trades.filter((trade: Trade) => (
        sameDay(trade.closeTime, today)
    ));
    return gainsPercent(accData);
}

const thisWeekGainsPercent = (accountData: AccountData, today: Date) => {
    const accData: AccountData = cloneObj(accountData);
    accData.trades = accData.trades.filter((trade: Trade) => (
        sameWeek(trade.closeTime, today)
    ));
    return gainsPercent(accData);
}

const thisMonthGainsPercent = (accountData: AccountData, today: Date) => {
    const accData: AccountData = cloneObj(accountData);
    accData.trades = accData.trades.filter((trade: Trade) => (
        sameMonth(trade.closeTime, today)
    ));
    return gainsPercent(accData);
}

const thisYearGainsPercent = (accountData: AccountData, today: Date) => {
    const accData: AccountData = cloneObj(accountData);
    accData.trades = accData.trades.filter((trade: Trade) => (
        sameYear(trade.closeTime, today)
    ));
    return gainsPercent(accData);
}

const allTimeGainsPercent = (accountData: AccountData) => {
    return gainsPercent(accountData);
}

const gainsPercent = (accountData: AccountData) => {
    return [
        {tradeNo: 0, gainsPercent: 0},
        ...balanceCalc(accountData)
            .map((calc, i) => ({
                tradeNo: i + 1, gainsPercent: gain(calc.trade.profitLoss, calc.balance)
            }))
    ]
}

const gain = (profitLoss: number, balance: number) => {
    if(balance == 0){
        return 0;
    }
    return (profitLoss / balance) * 100;
}

export default gainsGraphCalc