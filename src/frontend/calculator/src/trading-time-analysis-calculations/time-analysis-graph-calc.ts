import {AccountData, Trade} from '@root/types'
import {sameDay, sameWeek, sameMonth, sameYear} from '@root/utils'
import {TimeAnalysisGraphCalcItem} from '..'
import {TimeAnalysisGraphCalc} from './types'

/**
 * Graph of open hour against results
 */

const timeAnalysisGraphCalc = (accountData: AccountData, today: Date = new Date) => {
    const calculations: TimeAnalysisGraphCalc = {
        todayGraphCalc: todayGraphCalc(accountData, today),
        thisWeekGraphCalc: thisWeekGraphCalc(accountData, today),
        thisMonthGraphCalc: thisMonthGraphCalc(accountData, today),
        thisYearGraphCalc: thisYearGraphCalc(accountData, today),
        allTimeGraphCalc: allTimeGraphCalc(accountData, today)
    }
    return calculations
}

const todayGraphCalc = (accountData: AccountData, today: Date) => {
    return graphCalc(
        accountData.trades.filter((trade) => sameDay(trade.openTime, today))
    );
}

const thisWeekGraphCalc = (accountData: AccountData, today: Date) => {
    return graphCalc(
        accountData.trades.filter((trade) => sameWeek(trade.openTime, today))
    );
}

const thisMonthGraphCalc = (accountData: AccountData, today: Date) => {
    return graphCalc(
        accountData.trades.filter((trade) => sameMonth(trade.openTime, today))
    );
}

const thisYearGraphCalc = (accountData: AccountData, today: Date) => {
    return graphCalc(
        accountData.trades.filter((trade) => sameYear(trade.openTime, today))
    );
}

const allTimeGraphCalc = (accountData: AccountData, today: Date) => {
    return graphCalc(accountData.trades);
}

const graphCalc = (trades: Trade[]): TimeAnalysisGraphCalcItem[] => {
    const tradeHourToResultMap: {[key: string]: number} = {};
    for(const trade of trades){
        // extract the 06 in '2022-10-23T06:03:00Z'
        const hour = trade.openTime.split('T')[1].split(':')[0];
        if(!(hour in tradeHourToResultMap)){
            tradeHourToResultMap[hour] = 0;
        }
        tradeHourToResultMap[hour] += trade.profitLoss;
    }
    return Object.keys(tradeHourToResultMap).map((hour) => ({
        openHour: hour + ':00', result: tradeHourToResultMap[hour]
    }))
}

export default timeAnalysisGraphCalc