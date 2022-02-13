import {AccountData} from '@root/types'
import {OpenHourTableCalcItem} from '..'
import {OpenHourTableCalc} from './types'

const openHourTableCalc = (accountData: AccountData): OpenHourTableCalc => {
    const openHourMap: {[key: string]: Omit<OpenHourTableCalcItem, 'hour'>} = {}
    for(const trade of accountData.trades){
        const hour = formatTime(trade.openTime);
        if(!(hour in openHourMap)){
            openHourMap[hour] = {result: 0, noOfTrades: 0};
        }
        openHourMap[hour].result += trade.profitLoss;
        openHourMap[hour].noOfTrades += 1;
    }
    return Object.keys(openHourMap).map((hour) => ({
        hour, result: openHourMap[hour].result, noOfTrades: openHourMap[hour].noOfTrades
    }))
}

const formatTime = (rawTimeStr: string): string => {
    // In the general sense
    // extract the 18 in '2022-04-12T18:09:00+00:00' and return '18:00-18:59'
    const hour = rawTimeStr.split('T')[1].split(':')[0];
    return `${hour}:00 - ${hour}:59`
}

export default openHourTableCalc