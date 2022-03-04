import {cloneObj, sameDay, sameMonth, sameWeek, sameYear} from '@root/utils'
import {balanceCalc} from './common-calc'
import {AccountData, Trade} from '..'
import {CashGraphCalc} from './types'

/**
 * For calculating the datasets for the Cash Graph on the
 * Cash And Gains page
 */
const cashGraphCalc = (accountData: AccountData, today: Date = new Date()) => {
    const calculations: CashGraphCalc = {
        todayGraphCalc: todayGraphCalc(accountData, today),
        thisWeekGraphCalc: thisWeekGraphCalc(accountData, today),
        thisMonthGraphCalc: thisMonthGraphCalc(accountData, today),
        thisYearGraphCalc: thisYearGraphCalc(accountData, today),
        allTimeGraphCalc: allTimeGraphCalc(accountData, today)
    }
    return calculations
}

const todayGraphCalc = (accountData: AccountData, today: Date) => {
    const accData = cloneObj(accountData);
    accData.trades = accData.trades.filter((trade: Trade) => (
        sameDay(trade.closeTime, today)
    ));
    return graphCalc(accData);
}

const thisWeekGraphCalc = (accountData: AccountData, today: Date) => {
    const accData = cloneObj(accountData);
    accData.trades = accData.trades.filter((trade: Trade) => (
        sameWeek(trade.closeTime, today)
    ));
    return graphCalc(accData);
}

const thisMonthGraphCalc = (accountData: AccountData, today: Date) => {
    const accData = cloneObj(accountData);
    accData.trades = accData.trades.filter((trade: Trade) => (
        sameMonth(trade.closeTime, today)
    ));
    return graphCalc(accData);
}

const thisYearGraphCalc = (accountData: AccountData, today: Date) => {
    const accData = cloneObj(accountData);
    accData.trades = accData.trades.filter((trade: Trade) => (
        sameYear(trade.closeTime, today)
    ));
    return graphCalc(accData);
}

const allTimeGraphCalc = (accountData: AccountData, today: Date) => {
    return graphCalc(accountData);
}

const graphCalc = (accountData: AccountData) => {
    const initialDeposit = accountData.deposits.length !== 0 ? accountData.deposits[0].amount : 0
    return [
        {tradeNo: 0, balance: initialDeposit},
        ...balanceCalc(accountData)
            .map((calc, i) => ({
                tradeNo: i + 1, balance: calc.balance
            }))
    ]
}

export default cashGraphCalc
export {
    graphCalc
}