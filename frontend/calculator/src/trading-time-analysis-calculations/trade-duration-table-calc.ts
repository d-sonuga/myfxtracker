import {AccountData} from '@root/types'
import {TradeDurationTableCalc, TradeDurationTableCalcItem} from './types'


const tradeDurationTableCalc = (accountData: AccountData): TradeDurationTableCalc => {
    const durationMap: {[key: string]: Omit<TradeDurationTableCalcItem, 'duration'>} = {}
    for(const trade of accountData.trades){
        const duration = durationStr(trade.openTime, trade.closeTime);
        if(!(duration in durationMap)){
            durationMap[duration] = {result: 0, noOfTrades: 0}
        }
        durationMap[duration].result += trade.profitLoss;
        durationMap[duration].noOfTrades += 1;
    }
    return Object.keys(durationMap).map((duration) => ({
        duration,
        noOfTrades: durationMap[duration].noOfTrades,
        result: durationMap[duration].result
    }))
}

/**
 * Accepts the open time and close times of a trade
 * and returns an approximate duration in a string, like 1 week,
 * 2 mins, 1 hour.
 */
const durationStr = (openTimeStr: string, closeTimeStr: string): string => {
    const [openTimeDateStr, openTimeTimeStr] = openTimeStr.split('T');
    const [openTimeYearStr, openTimeMonthStr, openTimeDayStr] = openTimeDateStr.split('-');
    const [openTimeHourStr, openTimeMinutesStr] = openTimeTimeStr.split(':');

    const [closeTimeDateStr, closeTimeTimeStr] = closeTimeStr.split('T');
    const [closeTimeYearStr, closeTimeMonthStr, closeTimeDayStr] = closeTimeDateStr.split('-');
    const [closeTimeHourStr, closeTimeMinutesStr] = closeTimeTimeStr.split(':');
    
    let [minutes, hours] = (() => {
        // instantiate date objects with randoms dates
        // the days, months, and years aren't needed
        // all that these dates are used for are the time differences
        const randomYear = 2022;
        const randomMonth = 2;
        const randomDay = 2;
        const closeTimeDate = new Date(randomYear, randomMonth, randomDay);
        closeTimeDate.setHours(parseInt(closeTimeHourStr));
        closeTimeDate.setMinutes(parseInt(closeTimeMinutesStr));
        const openTimeDate = new Date(randomYear, randomMonth, randomDay);
        openTimeDate.setHours(parseInt(openTimeHourStr));
        openTimeDate.setMinutes(parseInt(openTimeMinutesStr));
        const difference = closeTimeDate.getTime() - openTimeDate.getTime();
        const totalMins = (difference / 1000) / 60;
        const hours = parseInt(`${totalMins / 60}`);
        const minutes = totalMins % 60;
        return [minutes, hours];
    })()
    let [days, weeks, months, years] = (() => {
        const closeTimeDate = new Date(
            parseInt(closeTimeYearStr),
            parseInt(closeTimeMonthStr) - 1,
            parseInt(closeTimeDayStr)
        );
        const openTimeDate = new Date(
            parseInt(openTimeYearStr),
            parseInt(openTimeMonthStr) - 1,
            parseInt(openTimeDayStr)
        );
        // The absolute difference in milliseconds
        const difference = closeTimeDate.getTime() - openTimeDate.getTime();
        // From milliseconds to days
        const totalDays = difference/1000/60/60/24;
        // How many weeks can the days fit in
        const totalWeeks = parseInt(`${totalDays / 7}`);
        // How many months can the weeks fit in
        const totalMonths = parseInt(`${totalWeeks / 4}`);
        // The remaining days that couldn't fit into the weeks
        const days = totalDays % 7;
        // The remaining weeks that couldn't fit into the months
        const weeks = totalWeeks % 4;
        // The remaining months that couldn't fit into years
        const months = totalMonths % 12;
        // How many years can the months fit in
        const years = parseInt(`${totalMonths / 12}`);
        return [days, weeks, months, years];
    })()
    if(minutes > 50){
        minutes = 0;
        hours += 1;
    }
    if(hours > 22){
        hours = 0;
        days += 1;
    }
    if(days > 3){
        days = 0;
        weeks += 1;
    }
    if(weeks > 3){
        weeks = 0;
        months += 1;
    }
    if(months > 11){
        months = 0;
        years += 1;
    }
    const durationInString = (n: number, unit: string) => {
        return n === 1 ? `1 ${unit}` : `${n} ${unit}s`
    }
    if(years > 0){
        return durationInString(years, 'year');
    }
    if(months > 0){
        return durationInString(months, 'month');
    }
    if(weeks > 0){
        return durationInString(weeks, 'week');
    }
    if(days > 0){
        return durationInString(days, 'day');
    }
    if(hours > 0){
        return durationInString(hours, 'hour');
    }
    if(minutes > 0){
        return durationInString(minutes, 'min');
    }
    return durationInString(1, 'min');
}

export default tradeDurationTableCalc