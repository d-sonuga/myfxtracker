"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
/**
 * Graph of open hour against results
 */
var timeAnalysisGraphCalc = function (accountData, today) {
    if (today === void 0) { today = new Date; }
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
    return graphCalc(accountData.trades.filter(function (trade) { return (0, utils_1.sameDay)(trade.openTime, today); }));
};
var thisWeekGraphCalc = function (accountData, today) {
    return graphCalc(accountData.trades.filter(function (trade) { return (0, utils_1.sameWeek)(trade.openTime, today); }));
};
var thisMonthGraphCalc = function (accountData, today) {
    return graphCalc(accountData.trades.filter(function (trade) { return (0, utils_1.sameMonth)(trade.openTime, today); }));
};
var thisYearGraphCalc = function (accountData, today) {
    return graphCalc(accountData.trades.filter(function (trade) { return (0, utils_1.sameYear)(trade.openTime, today); }));
};
var allTimeGraphCalc = function (accountData, today) {
    return graphCalc(accountData.trades);
};
var graphCalc = function (trades) {
    var tradeHourToResultMap = {};
    for (var _i = 0, trades_1 = trades; _i < trades_1.length; _i++) {
        var trade = trades_1[_i];
        // extract the 06 in '2022-10-23T06:03:00Z'
        var hour = trade.openTime.split('T')[1].split(':')[0];
        if (!(hour in tradeHourToResultMap)) {
            tradeHourToResultMap[hour] = 0;
        }
        tradeHourToResultMap[hour] += trade.profitLoss;
    }
    return Object.keys(tradeHourToResultMap).map(function (hour) { return ({
        openHour: hour + ':00', result: tradeHourToResultMap[hour]
    }); });
};
exports.default = timeAnalysisGraphCalc;
//# sourceMappingURL=time-analysis-graph-calc.js.map