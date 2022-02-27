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
exports.graphCalc = void 0;
var utils_1 = require("../utils");
var common_calc_1 = require("./common-calc");
/**
 * For calculating the datasets for the Cash Graph on the
 * Cash And Gains page
 */
var cashGraphCalc = function (accountData, today) {
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
    var accData = (0, utils_1.cloneObj)(accountData);
    accData.trades = accData.trades.filter(function (trade) { return ((0, utils_1.sameDay)(trade.closeTime, today)); });
    return graphCalc(accData);
};
var thisWeekGraphCalc = function (accountData, today) {
    var accData = (0, utils_1.cloneObj)(accountData);
    accData.trades = accData.trades.filter(function (trade) { return ((0, utils_1.sameWeek)(trade.closeTime, today)); });
    return graphCalc(accData);
};
var thisMonthGraphCalc = function (accountData, today) {
    var accData = (0, utils_1.cloneObj)(accountData);
    accData.trades = accData.trades.filter(function (trade) { return ((0, utils_1.sameMonth)(trade.closeTime, today)); });
    return graphCalc(accData);
};
var thisYearGraphCalc = function (accountData, today) {
    var accData = (0, utils_1.cloneObj)(accountData);
    accData.trades = accData.trades.filter(function (trade) { return ((0, utils_1.sameYear)(trade.closeTime, today)); });
    return graphCalc(accData);
};
var allTimeGraphCalc = function (accountData, today) {
    return graphCalc(accountData);
};
var graphCalc = function (accountData) {
    return __spreadArray([
        { tradeNo: 0, balance: 0 }
    ], (0, common_calc_1.balanceCalc)(accountData)
        .map(function (calc, i) { return ({
        tradeNo: i + 1, balance: calc.balance
    }); }), true);
};
exports.graphCalc = graphCalc;
exports.default = cashGraphCalc;
//# sourceMappingURL=cash-graph-calc.js.map