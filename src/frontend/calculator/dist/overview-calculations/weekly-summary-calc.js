"use strict";
/**
 * Functions for calculating the info on the weekly summary table
 * The weekly summary calculates the total number of trades,
 * lots and profit gotten for each day of the current week,
 * from Friday to Monday
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeekDates = void 0;
var weeklySummaryCalc = function (accountData, today) {
    if (today === void 0) { today = new Date(); }
    var calculations = {};
    var weekDates = getWeekDates(today);
    for (var _i = 0, weekDates_1 = weekDates; _i < weekDates_1.length; _i++) {
        var weekDate = weekDates_1[_i];
        calculations[dateToString(weekDate)] = {
            trades: 0,
            lots: 0,
            result: 0
        };
    }
    for (var _a = 0, _b = accountData.trades; _a < _b.length; _a++) {
        var trade = _b[_a];
        for (var _c = 0, weekDates_2 = weekDates; _c < weekDates_2.length; _c++) {
            var weekDate = weekDates_2[_c];
            if (extractDateStr(trade.closeTime) === dateToTradeDateFormat(weekDate)) {
                var strDate = dateToString(weekDate);
                calculations[strDate]['trades'] += 1;
                if (trade.lots) {
                    calculations[strDate]['lots'] += trade.lots;
                }
                calculations[strDate]['result'] += trade.profitLoss;
            }
        }
    }
    return calculations;
};
/** Receives a date and returns the dates of all days in the week, from monday to friday */
var getWeekDates = function (today) {
    /** Dates of the format 01 Jan, 13 Oct, ... */
    // Dates are always in the descending order, from latest to earliest
    var dates = [];
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
    for (var i = FRIDAY - today.getDay(); i >= 0; i--) {
        var dayToAdd = new Date(today);
        // Don't add Sundays
        if (!(today.getDay() === SUNDAY && i === 0)) {
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
    for (var i = MONDAY; i < today.getDay(); i++) {
        var dayToAdd = new Date(today);
        dayToAdd.setDate(today.getDate() - i);
        dates.push(dayToAdd);
    }
    return dates;
};
exports.getWeekDates = getWeekDates;
var dateToString = function (date) {
    return "".concat(date.getDate(), " ").concat(monthMap[date.getMonth()]);
};
/** Converts date object into the format of date in the accountData trades */
var dateToTradeDateFormat = function (date) {
    // Add one because JS's months are 0-indexed
    var month = date.getMonth() + 1;
    var monthStr = month < 10 ? "0".concat(month) : "".concat(month);
    var day = date.getDate();
    var dayStr = day < 10 ? "0".concat(day) : "".concat(day);
    return "".concat(date.getFullYear(), "-").concat(monthStr, "-").concat(dayStr);
};
/**
* Takes date string of the format 2022-04-22 18:34:00+00:00 and returns 2022-04-22
*/
var extractDateStr = function (dateStr) {
    return dateStr.split('T')[0];
};
var SUNDAY = 0;
var MONDAY = 1;
var TUESDAY = 2;
var WEDNESDAY = 3;
var THURSDAY = 4;
var FRIDAY = 5;
var SATURDAY = 6;
var monthMap = {
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
};
exports.default = weeklySummaryCalc;
//# sourceMappingURL=weekly-summary-calc.js.map