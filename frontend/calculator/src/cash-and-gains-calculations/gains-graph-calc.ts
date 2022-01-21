import {Trade} from '@root/types'
import {cloneObj, sameDay, sameMonth, sameWeek, sameYear, sumObjArray} from '@root/utils'
import {AccountData} from '..'
import {GainsGraphCalc, GainsGraphItem} from './types'


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
    const accData = cloneObj(accountData);
    accData.trades = accData.trades.filter((trade: Trade) => (
        sameDay(trade.exit_date, today)
    ));
    return gainsPercent(accData);
}

const thisWeekGainsPercent = (accountData: AccountData, today: Date) => {
    const accData = cloneObj(accountData);
    accData.trades = accData.trades.filter((trade: Trade) => (
        sameWeek(trade.exit_date, today)
    ));
    return gainsPercent(accData);
}

const thisMonthGainsPercent = (accountData: AccountData, today: Date) => {
    const accData = cloneObj(accountData);
    accData.trades = accData.trades.filter((trade: Trade) => (
        sameMonth(trade.exit_date, today)
    ));
    return gainsPercent(accData);
}

const thisYearGainsPercent = (accountData: AccountData, today: Date) => {
    const accData = cloneObj(accountData);
    accData.trades = accData.trades.filter((trade: Trade) => (
        sameYear(trade.exit_date, today)
    ));
    return gainsPercent(accData);
}

const allTimeGainsPercent = (accountData: AccountData) => {
    return gainsPercent(accountData);
}

const gainsPercent = (accountData: AccountData) => {
    const calc: GainsGraphItem[] = [{tradeNo: 0, gainsPercent: 0}];
    const totalDeposits = sumObjArray(accountData.deposits, 'amount');
    for(const i in accountData.trades){
        const trade = accountData.trades[i];
        const gain = totalDeposits !== 0 ? trade.profit_loss / totalDeposits : 0;
        const gainsPercent = gain * 100;
        calc.push({tradeNo: parseInt(i) + 1, gainsPercent})
    }
    return calc
}

export default gainsGraphCalc