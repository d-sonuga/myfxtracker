/**
 * Functions for calculating the info on the weekly summary table
 * The weekly summary calculates the total number of trades,
 * lots and profit gotten for each day of the current week,
 * from Friday to Monday
 */

import {OverviewWeeklySummaryCalc} from './types'
import {AccountData} from '../types'


const weeklySummaryCalc = (accountData: AccountData, today: Date = new Date()) => {
    let calculations: OverviewWeeklySummaryCalc = {};
    const dates = getWeekDates(today);
    for(const date of dates){
        calculations[dateToString(date)] = {
            trades: 0,
            lots: 0,
            result: 0
        }
    }
    for(const trade of accountData.trades){
        for(const date of dates){
            if(extractDateStr(trade.closeTime) === dateToTradeDateFormat(date)){
                const strDate: string = dateToString(date);
                calculations[strDate]['trades'] += 1;
                if(trade.lots){
                    calculations[strDate]['lots'] += trade.lots;
                }
                calculations[strDate]['result'] += trade.profitLoss;
            }
        }
    }
    return calculations;
}

/** Receives a date and returns the dates of all days in the week, from monday to friday */
const getWeekDates = (today: Date) => {
    /** Dates of the format 01 Jan, 13 Oct, ... */
    // Dates are always in the descending order, from latest to earliest
    let dates = [];
    /**
     * To get all dates from Friday to today
     * Friday's index is 5
     * today's index is anywhere from 0 to 6
     * At any point in time, 
     * Friday's index - today's index = number of days to add to today to get Friday
     * That's why i starts from Friday's index - today's index
     * When the date gets moved forward by the initial i times, it becomes the Friday of the week
     * i then keeps reducing, so when today is increased by i - 1, it becomes the Thursday of the week
     * This continues until i becomes 0
     * When i is 0, today gets added, because today is moved forward 0 times
     * Except when today is Sunday. Since Sunday should never be added, a condition is in place
     * to first check if the day is sunday.
     */
    for(let i=FRIDAY - today.getDay(); i>=0; i--){
        let dayToAdd = new Date(today);
        // Don't add Sundays
        if(!(today.getDay() === SUNDAY && i === 0)){
            dayToAdd.setDate(today.getDate() + i);
            dates.push(dayToAdd);
        }
    }
    /**
     * To get the remaining days from yesterday to Monday
     * i starts from Monday's index because Monday's index is 1
     * today's date moved back by 1 will give yesterday's date
     * Moved back by 2 will give day before yesterday's date
     * So we start from Monday's index, which is 1
     * i then increases until it is the index of yesterday
     * At any point, today's date moved back by yesterday's index will give Monday
     */
    for(let i=MONDAY; i<today.getDay(); i++){
        let dayToAdd = new Date(today);
        dayToAdd.setDate(today.getDate() - i);
        dates.push(dayToAdd);
    }
    return dates
}

const dateToString = (date: Date) => {
    return `${date.getDate()} ${monthMap[date.getMonth()]}`
}

/** Converts date object into the format of date in the accountData trades */
const dateToTradeDateFormat = (date: Date) => {
    // Add one because JS's months are 0-indexed
    let month = date.getMonth() + 1;
    let monthStr = month < 10 ? `0${month}` : `${month}`;
    return `${date.getFullYear()}-${monthStr}-${date.getDate()}`
}

/**
* Takes date string of the format 2022-04-22 18:34:00+00:00 and returns 2022-04-22
*/
const extractDateStr = (dateStr: string) => {
    return dateStr.split(' ')[0]
}

const SUNDAY = 0;
const MONDAY = 1;
const TUESDAY = 2;
const WEDNESDAY = 3;
const THURSDAY = 4;
const FRIDAY = 5;
const SATURDAY = 6;

const monthMap: {[key: number]: string} = {
    0: 'Jan',
    1: 'Feb',
    2: 'Mar',
    3: 'Apr',
    4: 'May',
    5: 'Jun',
    6: 'Jul',
    7: 'Aug',
    8: 'Sep',
    9: 'Oct',
    10: 'Nov',
    11: 'Dec'
}

export default weeklySummaryCalc
export {getWeekDates}