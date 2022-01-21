import {AccountData} from '..'
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
 * The result is the profit / loss of that trade.
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
    return [
        {tradeNo: 0, result: 0},
        ...accountData.trades
            .filter((trade) => periodCondition(trade.exit_date, today))
            .map((trade, i) => (
                {tradeNo: i + 1, result: trade.profit_loss}
            ))
    ]
}

/**
 * Does the date in @param dateStr fall in the same day as @param otherDate
 */
const sameDay = (dateStr: string, otherDate: Date): boolean => {
    const date = new Date(dateStr);
    // If they fall on the same year, month and day, then they fell on the same day
    return date.getFullYear() === otherDate.getFullYear() && date.getMonth() === otherDate.getMonth()
        && date.getDate() === otherDate.getDate()
}

/**
 * Does the date in @param dateStr fall in the same week as @param otherDate
 */
const sameWeek = (dateStr: string, otherDate: Date) => {
    const date = new Date(dateStr);
    /**
     * Upper bound is Sunday 12 am and lower bound is Saturday 11:59 pm
     * If today is Sunday, then date will have to be subtracted 0 times (it's date index: 0)
     * If today is Monday, then date will have to be subtracted 1 time (it's date index: 1)
     * If today is Tuesday, then date will have to be subtracted 2 times (it's date index: 2)
     * In general, to get Sunday from any day, you take the date back by the day's date index
     * which happen to be 0, 1, 2, 3, 4, 5, 6 for Sunday, ..., Saturday respectively
     */
    const getLowerBound = (otherDate: Date) => {
        // Initialize to the otherDate
        let lowerBound = new Date(otherDate);
        // Take the date back by the day's date index
        lowerBound.setDate(lowerBound.getDate() - lowerBound.getDay());
        // Set the Sunday's time to 12 am on the dot
        lowerBound.setHours(12);
        lowerBound.setMinutes(0);
        lowerBound.setSeconds(0);
        lowerBound.setMilliseconds(0);
        return lowerBound;
    }
    const lowerBound = getLowerBound(otherDate);
    /**
     * Lower bound is Saturday 11:59 pm
     * If today is Sunday, then date will have to be moved forward by 6 (6 - 0)
     * If today is Monday, then date will have to be moved forward by 5 (6 - 1)
     * If today is Tuesday, then date will have to be moved forward by 4 (6 - 2)
     * ...
     * To get get Saturday from any day, you take the date forward by 6 - day's date index
     */
    const getUpperBound = (otherDate: Date) => {
        let upperBound = new Date(otherDate);
        // Make it a Saturday
        upperBound.setDate(upperBound.getDate() + (6 - upperBound.getDay()));
        // Set the Saturday's time to 11:59:59 p.m.
        upperBound.setHours(23);
        upperBound.setMinutes(59);
        upperBound.setSeconds(59);
        return upperBound;
    }
    const upperBound = getUpperBound(otherDate);
    /**
     * Does @param date fall between @param upperBound and @param lowerBound?
     */
    const dateFallsWithinRange = (date: Date, upperBound: Date, lowerBound: Date) => {
        return date >= lowerBound && date <= upperBound
    }
    return dateFallsWithinRange(date, upperBound, lowerBound);
}

/**
 * Does the date in @param dateStr fall in the same month as @param otherDate
 */
const sameMonth = (dateStr: string, otherDate: Date) => {
    const date = new Date(dateStr);
    // If they fell in the same year, and the same month,
    // then they fell in the same month
    return date.getFullYear() === otherDate.getFullYear() && date.getMonth() === otherDate.getMonth()
}

/**
 * Does the date in @param dateStr fall in the same year as @param otherDate
 */
 const sameYear = (dateStr: string, otherDate: Date) => {
    const date = new Date(dateStr);
    return date.getFullYear() === otherDate.getFullYear()
}

export default accountReturnsGraphCalc