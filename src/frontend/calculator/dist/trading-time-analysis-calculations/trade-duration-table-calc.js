"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tradeDurationTableCalc = function (accountData) {
    var durationMap = {};
    for (var _i = 0, _a = accountData.trades; _i < _a.length; _i++) {
        var trade = _a[_i];
        var duration = durationStr(trade.openTime, trade.closeTime);
        if (!(duration in durationMap)) {
            durationMap[duration] = { result: 0, noOfTrades: 0 };
        }
        durationMap[duration].result += trade.profitLoss;
        durationMap[duration].noOfTrades += 1;
    }
    return Object.keys(durationMap).map(function (duration) { return ({
        duration: duration,
        noOfTrades: durationMap[duration].noOfTrades,
        result: durationMap[duration].result
    }); });
};
/**
 * Accepts the open time and close times of a trade
 * and returns an approximate duration in a string, like 1 week,
 * 2 mins, 1 hour.
 */
var durationStr = function (openTimeStr, closeTimeStr) {
    var _a = openTimeStr.split('T'), openTimeDateStr = _a[0], openTimeTimeStr = _a[1];
    var _b = openTimeDateStr.split('-'), openTimeYearStr = _b[0], openTimeMonthStr = _b[1], openTimeDayStr = _b[2];
    var _c = openTimeTimeStr.split(':'), openTimeHourStr = _c[0], openTimeMinutesStr = _c[1];
    var _d = closeTimeStr.split('T'), closeTimeDateStr = _d[0], closeTimeTimeStr = _d[1];
    var _e = closeTimeDateStr.split('-'), closeTimeYearStr = _e[0], closeTimeMonthStr = _e[1], closeTimeDayStr = _e[2];
    var _f = closeTimeTimeStr.split(':'), closeTimeHourStr = _f[0], closeTimeMinutesStr = _f[1];
    var _g = (function () {
        // instantiate date objects with randoms dates
        // the days, months, and years aren't needed
        // all that these dates are used for are the time differences
        var randomYear = 2022;
        var randomMonth = 2;
        var randomDay = 2;
        var closeTimeDate = new Date(randomYear, randomMonth, randomDay);
        closeTimeDate.setHours(parseInt(closeTimeHourStr));
        closeTimeDate.setMinutes(parseInt(closeTimeMinutesStr));
        var openTimeDate = new Date(randomYear, randomMonth, randomDay);
        openTimeDate.setHours(parseInt(openTimeHourStr));
        openTimeDate.setMinutes(parseInt(openTimeMinutesStr));
        var difference = closeTimeDate.getTime() - openTimeDate.getTime();
        var totalMins = (difference / 1000) / 60;
        var hours = parseInt("".concat(totalMins / 60));
        var minutes = totalMins % 60;
        return [minutes, hours];
    })(), minutes = _g[0], hours = _g[1];
    var _h = (function () {
        var closeTimeDate = new Date(parseInt(closeTimeYearStr), parseInt(closeTimeMonthStr) - 1, parseInt(closeTimeDayStr));
        var openTimeDate = new Date(parseInt(openTimeYearStr), parseInt(openTimeMonthStr) - 1, parseInt(openTimeDayStr));
        // The absolute difference in milliseconds
        var difference = closeTimeDate.getTime() - openTimeDate.getTime();
        // From milliseconds to days
        var totalDays = difference / 1000 / 60 / 60 / 24;
        // How many weeks can the days fit in
        var totalWeeks = parseInt("".concat(totalDays / 7));
        // How many months can the weeks fit in
        var totalMonths = parseInt("".concat(totalWeeks / 4));
        // The remaining days that couldn't fit into the weeks
        var days = totalDays % 7;
        // The remaining weeks that couldn't fit into the months
        var weeks = totalWeeks % 4;
        // The remaining months that couldn't fit into years
        var months = totalMonths % 12;
        // How many years can the months fit in
        var years = parseInt("".concat(totalMonths / 12));
        return [days, weeks, months, years];
    })(), days = _h[0], weeks = _h[1], months = _h[2], years = _h[3];
    if (minutes > 50) {
        minutes = 0;
        hours += 1;
    }
    if (hours > 22) {
        hours = 0;
        days += 1;
    }
    if (days > 3) {
        days = 0;
        weeks += 1;
    }
    if (weeks > 3) {
        weeks = 0;
        months += 1;
    }
    if (months > 11) {
        months = 0;
        years += 1;
    }
    var durationInString = function (n, unit) {
        return n === 1 ? "1 ".concat(unit) : "".concat(n, " ").concat(unit, "s");
    };
    if (years > 0) {
        return durationInString(years, 'year');
    }
    if (months > 0) {
        return durationInString(months, 'month');
    }
    if (weeks > 0) {
        return durationInString(weeks, 'week');
    }
    if (days > 0) {
        return durationInString(days, 'day');
    }
    if (hours > 0) {
        return durationInString(hours, 'hour');
    }
    if (minutes > 0) {
        return durationInString(minutes, 'min');
    }
    return durationInString(1, 'min');
};
exports.default = tradeDurationTableCalc;
//# sourceMappingURL=trade-duration-table-calc.js.map