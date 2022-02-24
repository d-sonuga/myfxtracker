"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
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
    accData.trades = accData.trades.filter(function (trade) { return ((0, utils_1.sameDay)(trade.openTime, today)); });
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
    var calc = [{ tradeNo: 0, gainsPercent: 0 }];
    var totalDeposits = (0, utils_1.sumObjArray)(accountData.deposits, 'amount');
    for (var i in accountData.trades) {
        var trade = accountData.trades[i];
        var gain = totalDeposits !== 0 ? trade.profitLoss / totalDeposits : 0;
        var gainsPercent_1 = gain * 100;
        calc.push({ tradeNo: parseInt(i) + 1, gainsPercent: gainsPercent_1 });
    }
    return calc;
};
exports.default = gainsGraphCalc;
//# sourceMappingURL=gains-graph-calc.js.map