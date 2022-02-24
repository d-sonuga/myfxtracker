import {AccountData} from '..'
import {sameDay, sameWeek, sameMonth, sameYear} from '@root/utils'
import {OverviewAccountReturnsGraphCalc} from './types'

/**
 * For calculating the datasets for the Account Returns graph
 * on the overview page of the trader app
 */

/**
 * Each item in the object is an array of objects
 * with keys tradeNo and result.
 * tradeNo is the index of a trade in a chronologically ordered
 * array of trades. For example, if trade A is the first trade a user
 * ever made and trade B was made after it, then trade A will have a tradeNo
 * of 0 and trade B will have a tradeNo of 1
 * The result is the cummulative profit / loss of that trade.
 * That is the result is the addition of all the previous profit / losses and the profitLoss of
 * the trade with the current tradeNo
 * Each field in the calculations object shows different views over the
 * same data, which correspond to different time ranges:
 * today, this week, this month, this year and all time
 */
const accountReturnsGraphCalc = (accountData: AccountData, today: Date = new Date()) => {
    const calculations: OverviewAccountReturnsGraphCalc = {
        todayGraphCalc: todayGraphCalc(accountData, today),
        thisWeekGraphCalc: thisWeekGraphCalc(accountData, today),
        thisMonthGraphCalc: thisMonthGraphCalc(accountData, today),
        thisYearGraphCalc: thisYearGraphCalc(accountData, today),
        allTimeGraphCalc: allTimeGraphCalc(accountData, today)
    }
    return calculations
}

const todayGraphCalc = (accountData: AccountData, today: Date) => {
    return graphCalc(accountData, sameDay, today);
}

const thisWeekGraphCalc = (accountData: AccountData, today: Date) => {
    return graphCalc(accountData, sameWeek, today);
}

const thisMonthGraphCalc = (accountData: AccountData, today: Date) => {
    return graphCalc(accountData, sameMonth, today);
}

const thisYearGraphCalc = (accountData: AccountData, today: Date) => {
    return graphCalc(accountData, sameYear, today);
}

const allTimeGraphCalc = (accountData: AccountData, today: Date) => {
    return graphCalc(accountData, () => true, today);
}

/**
 * Create graph calc with the only the subset of the trades whose exit_date
 * satisfies the period condition and makes it return true
 */
const graphCalc = (accountData: AccountData, periodCondition: Function, today: Date) => {
    let cummulativeProfitLoss = 0;
    return [
        {tradeNo: 0, result: 0},
        ...accountData.trades
            .filter((trade) => periodCondition(trade.closeTime, today))
            .map((trade, i) => {
                cummulativeProfitLoss += trade.profitLoss;
                return {
                    tradeNo: i + 1,
                    result: cummulativeProfitLoss
                }
            })
    ]
}

export default accountReturnsGraphCalc