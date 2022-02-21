"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
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
var accountReturnsGraphCalc = function (accountData, today) {
    if (today === void 0) { today = new Date(); }
    var calculations = {
        todayGraphCalc: todayGraphCalc(accountData, today),
        thisWeekGraphCalc: thisWeekGraphCalc(accountData, today),
        thisMonthGraphCalc: thisMonthGraphCalc(accountData, today),
        thisYearGraphCalc: thisYearGraphCalc(accountData, today),
        allTimeGraphCalc: allTimeGraphCalc(accountData, today)
    };
    return calculations;
};
var todayGraphCalc = function (accountData, today) {
    return graphCalc(accountData, utils_1.sameDay, today);
};
var thisWeekGraphCalc = function (accountData, today) {
    return graphCalc(accountData, utils_1.sameWeek, today);
};
var thisMonthGraphCalc = function (accountData, today) {
    return graphCalc(accountData, utils_1.sameMonth, today);
};
var thisYearGraphCalc = function (accountData, today) {
    return graphCalc(accountData, utils_1.sameYear, today);
};
var allTimeGraphCalc = function (accountData, today) {
    return graphCalc(accountData, function () { return true; }, today);
};
/**
 * Create graph calc with the only the subset of the trades whose exit_date
 * satisfies the period condition and makes it return true
 */
var graphCalc = function (accountData, periodCondition, today) {
    return __spreadArray([
        { tradeNo: 0, result: 0 }
    ], accountData.trades
        .filter(function (trade) { return periodCondition(trade.closeTime, today); })
        .map(function (trade, i) { return ({ tradeNo: i + 1, result: trade.profitLoss }); }), true);
};
exports.default = accountReturnsGraphCalc;
//# sourceMappingURL=account-returns-graph-calc.js.map