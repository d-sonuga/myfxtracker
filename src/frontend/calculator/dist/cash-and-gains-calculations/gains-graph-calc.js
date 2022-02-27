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
var common_calc_1 = require("./common-calc");
/**
 * Gains graph is a graph of cummulative gains percentages against tradeNo
 * gainsPercent is defined as profitLoss / totalDeposits
 * Each item in the object is an array of objects
 * with keys tradeNo and gainsPercent.
 * tradeNo is the index of a trade in a chronologically ordered
 * array of trades. For example, if trade A is the first trade a user
 * ever made and trade B was made after it, then trade A will have a tradeNo
 * of 0 and trade B will have a tradeNo of 1
 * The gainsPercent is the cummulative profit / loss of that trade.
 * That is the gainsPercent is the addition of all the profit profit / losses up to
 * the one with the current tradeNo divided by all the deposits up to the last deposit that happened
 * on or before the trade with the current tradeNo took place
 * Each field in the calculations object shows different views over the
 * same data, which correspond to different time ranges:
 * today, this week, this month, this year and all time
 */
var gainsGraphCalc = function (accountData, today) {
    if (today === void 0) { today = new Date(); }
    var calculations = {
        todayGraphCalc: todayGainsPercent(accountData, today),
        thisWeekGraphCalc: thisWeekGainsPercent(accountData, today),
        thisMonthGraphCalc: thisMonthGainsPercent(accountData, today),
        thisYearGraphCalc: thisYearGainsPercent(accountData, today),
        allTimeGraphCalc: allTimeGainsPercent(accountData)
    };
    return calculations;
};
var todayGainsPercent = function (accountData, today) {
    var accData = (0, utils_1.cloneObj)(accountData);
    accData.trades = accData.trades.filter(function (trade) { return ((0, utils_1.sameDay)(trade.closeTime, today)); });
    return gainsPercent(accData);
};
var thisWeekGainsPercent = function (accountData, today) {
    var accData = (0, utils_1.cloneObj)(accountData);
    accData.trades = accData.trades.filter(function (trade) { return ((0, utils_1.sameWeek)(trade.closeTime, today)); });
    return gainsPercent(accData);
};
var thisMonthGainsPercent = function (accountData, today) {
    var accData = (0, utils_1.cloneObj)(accountData);
    accData.trades = accData.trades.filter(function (trade) { return ((0, utils_1.sameMonth)(trade.closeTime, today)); });
    return gainsPercent(accData);
};
var thisYearGainsPercent = function (accountData, today) {
    var accData = (0, utils_1.cloneObj)(accountData);
    accData.trades = accData.trades.filter(function (trade) { return ((0, utils_1.sameYear)(trade.closeTime, today)); });
    return gainsPercent(accData);
};
var allTimeGainsPercent = function (accountData) {
    return gainsPercent(accountData);
};
var gainsPercent = function (accountData) {
    return __spreadArray([
        { tradeNo: 0, gainsPercent: 0 }
    ], (0, common_calc_1.balanceCalc)(accountData)
        .map(function (calc, i) { return ({
        tradeNo: i + 1, gainsPercent: gain(calc.trade.profitLoss, calc.balance)
    }); }), true);
};
var gain = function (profitLoss, balance) {
    if (balance == 0) {
        return 0;
    }
    return (profitLoss / balance) * 100;
};
exports.default = gainsGraphCalc;
//# sourceMappingURL=gains-graph-calc.js.map