"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var returnsPerPeriodGraphCalc = function (accountData) {
    var calculations = {
        daily: dailyReturnsPerPeriod(accountData.trades),
        monthly: monthlyReturnsPerPeriod(accountData.trades),
        yearly: yearlyReturnsPerPeriodGraphCalc(accountData.trades)
    };
    return calculations;
};
var dailyReturnsPerPeriod = function (trades) {
    var _a;
    var returnsPerPeriod = (_a = {},
        _a[MONDAY] = 0,
        _a[TUESDAY] = 0,
        _a[WEDNESDAY] = 0,
        _a[THURSDAY] = 0,
        _a[FRIDAY] = 0,
        _a);
    var calculateReturnsPerPeriod = function () {
        for (var _i = 0, trades_1 = trades; _i < trades_1.length; _i++) {
            var trade = trades_1[_i];
            var date = new Date(trade.closeTime);
            var day = date.getDay();
            returnsPerPeriod[day] += trade.profitLoss;
        }
    };
    var formatReturnsPerPeriod = function () {
        return Object.keys(returnsPerPeriod).map(function (day) { return ({ day: dayNoToString[parseInt(day)], result: returnsPerPeriod[parseInt(day)] }); });
    };
    calculateReturnsPerPeriod();
    return formatReturnsPerPeriod();
};
var monthlyReturnsPerPeriod = function (trades) {
    var _a;
    var returnsPerPeriod = (_a = {},
        _a[JANUARY] = 0,
        _a[FEBRUARY] = 0,
        _a[MARCH] = 0,
        _a[APRIL] = 0,
        _a[MAY] = 0,
        _a[JUNE] = 0,
        _a[JULY] = 0,
        _a[AUGUST] = 0,
        _a[SEPTEMBER] = 0,
        _a[OCTOBER] = 0,
        _a[NOVEMBER] = 0,
        _a[DECEMBER] = 0,
        _a);
    var calculateReturnsPerPeriod = function () {
        for (var _i = 0, trades_2 = trades; _i < trades_2.length; _i++) {
            var trade = trades_2[_i];
            var date = new Date(trade.closeTime);
            var month = date.getMonth();
            returnsPerPeriod[month] += trade.profitLoss;
        }
    };
    var formatReturnsPerPeriod = function () {
        return Object.keys(returnsPerPeriod).map(function (month) { return ({ month: monthNoToString[parseInt(month)], result: returnsPerPeriod[parseInt(month)] }); });
    };
    calculateReturnsPerPeriod();
    return formatReturnsPerPeriod();
};
var yearlyReturnsPerPeriodGraphCalc = function (trades) {
    var returnsPerPeriod = {};
    var calculateReturnsPerPeriod = function () {
        for (var _i = 0, trades_3 = trades; _i < trades_3.length; _i++) {
            var trade = trades_3[_i];
            var year = new Date(trade.closeTime).getFullYear();
            if (!(year in returnsPerPeriod)) {
                returnsPerPeriod[year] = 0;
            }
            returnsPerPeriod[year] += trade.profitLoss;
        }
    };
    var formatReturnsPerPeriod = function () {
        return Object.keys(returnsPerPeriod).map(function (year) { return ({ year: parseInt(year), result: returnsPerPeriod[parseInt(year)] }); });
    };
    calculateReturnsPerPeriod();
    return formatReturnsPerPeriod();
};
var MONDAY = 1;
var TUESDAY = 2;
var WEDNESDAY = 3;
var THURSDAY = 4;
var FRIDAY = 5;
var JANUARY = 0;
var FEBRUARY = 1;
var MARCH = 2;
var APRIL = 3;
var MAY = 4;
var JUNE = 5;
var JULY = 6;
var AUGUST = 7;
var SEPTEMBER = 8;
var OCTOBER = 9;
var NOVEMBER = 10;
var DECEMBER = 11;
var dayNoToString = (_a = {},
    _a[MONDAY] = 'Monday',
    _a[TUESDAY] = 'Tuesday',
    _a[WEDNESDAY] = 'Wednesday',
    _a[THURSDAY] = 'Thursday',
    _a[FRIDAY] = 'Friday',
    _a);
var monthNoToString = (_b = {},
    _b[JANUARY] = 'January',
    _b[FEBRUARY] = 'February',
    _b[MARCH] = 'March',
    _b[APRIL] = 'April',
    _b[MAY] = 'May',
    _b[JUNE] = 'June',
    _b[JULY] = 'July',
    _b[AUGUST] = 'August',
    _b[SEPTEMBER] = 'September',
    _b[OCTOBER] = 'October',
    _b[NOVEMBER] = 'November',
    _b[DECEMBER] = 'December',
    _b);
exports.default = returnsPerPeriodGraphCalc;
//# sourceMappingURL=returns-per-period-graph-calc.js.map