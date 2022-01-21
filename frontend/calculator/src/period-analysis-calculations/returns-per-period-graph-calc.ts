import {AccountData, Trade} from '@root/types'
import {DayKey, MonthKey, ReturnsPerPeriodGraphCalc} from './types'


const returnsPerPeriodGraphCalc = (accountData: AccountData) => {
    const calculations: ReturnsPerPeriodGraphCalc = {
        daily: dailyReturnsPerPeriod(accountData.trades),
        monthly: monthlyReturnsPerPeriod(accountData.trades),
        yearly: yearlyReturnsPerPeriodGraphCalc(accountData.trades)
    }
    return calculations
}

const dailyReturnsPerPeriod = (trades: Trade[]) => {
    const returnsPerPeriod: {[key: number]: number} = {
        [MONDAY]: 0, [TUESDAY]: 0, [WEDNESDAY]: 0,
        [THURSDAY]: 0, [FRIDAY]: 0
    };
    const calculateReturnsPerPeriod = () => {
        for(const trade of trades){
            const date = new Date(trade.exit_date);
            const day = date.getDay();
            returnsPerPeriod[day] += trade.profit_loss;
        }
    }
    const formatReturnsPerPeriod = () => {
        return Object.keys(returnsPerPeriod).map((day: string) => (
            {day: dayNoToString[parseInt(day)], result: returnsPerPeriod[parseInt(day)]}
        ))
    }
    calculateReturnsPerPeriod();
    return formatReturnsPerPeriod();
}

const monthlyReturnsPerPeriod = (trades: Trade[]) => {
    const returnsPerPeriod: {[key: number]: number} = {
        [JANUARY]: 0, [FEBRUARY]: 0, [MARCH]: 0,
        [APRIL]: 0, [MAY]: 0, [JUNE]: 0, [JULY]: 0, [AUGUST]: 0, [SEPTEMBER]: 0,
        [OCTOBER]: 0, [NOVEMBER]: 0, [DECEMBER]: 0
    };
    const calculateReturnsPerPeriod = () => {
        for(const trade of trades){
            const date = new Date(trade.exit_date);
            const month = date.getMonth();
            returnsPerPeriod[month] += trade.profit_loss;
        }
    }
    const formatReturnsPerPeriod = () => {
        return Object.keys(returnsPerPeriod).map((month: string) => (
            {month: monthNoToString[parseInt(month)], result: returnsPerPeriod[parseInt(month)]}
        ))
    }
    calculateReturnsPerPeriod();
    return formatReturnsPerPeriod()
}

const yearlyReturnsPerPeriodGraphCalc = (trades: Trade[]) => {
    const returnsPerPeriod: {[key: number]: number} = {}
    const calculateReturnsPerPeriod = () => {
        for(const trade of trades){
            const year = new Date(trade.exit_date).getFullYear();
            if(!(year in returnsPerPeriod)){
                returnsPerPeriod[year] = 0;
            }
            returnsPerPeriod[year] += trade.profit_loss;
        }
    }
    const formatReturnsPerPeriod = () => {
        return Object.keys(returnsPerPeriod).map((year: string) => (
            {year: parseInt(year), result: returnsPerPeriod[parseInt(year)]}
        ))
    }
    calculateReturnsPerPeriod();
    return formatReturnsPerPeriod();
}

const MONDAY = 1;
const TUESDAY = 2;
const WEDNESDAY = 3;
const THURSDAY = 4;
const FRIDAY = 5;

const JANUARY = 0;
const FEBRUARY = 1;
const MARCH = 2;
const APRIL = 3;
const MAY = 4;
const JUNE = 5;
const JULY = 6;
const AUGUST = 7;
const SEPTEMBER = 8;
const OCTOBER = 9;
const NOVEMBER = 10;
const DECEMBER = 11;

const dayNoToString: {[key: number]: DayKey} = {
    [MONDAY]: 'Monday',
    [TUESDAY]: 'Tuesday',
    [WEDNESDAY]: 'Wednesday',
    [THURSDAY]: 'Thursday',
    [FRIDAY]: 'Friday'
}

const monthNoToString: {[key: number]: MonthKey} = {
    [JANUARY]: 'January',
    [FEBRUARY]: 'February',
    [MARCH]: 'March',
    [APRIL]: 'April',
    [MAY]: 'May',
    [JUNE]: 'June',
    [JULY]: 'July',
    [AUGUST]: 'August',
    [SEPTEMBER]: 'September',
    [OCTOBER]: 'October',
    [NOVEMBER]: 'November',
    [DECEMBER]: 'December'
}

export default returnsPerPeriodGraphCalc