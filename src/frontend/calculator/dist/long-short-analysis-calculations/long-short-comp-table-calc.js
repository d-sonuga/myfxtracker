"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_calc_1 = require("../common-calc");
var common_calc_2 = require("./common-calc");
var longShortComparisonTableCalc = function (accountData) {
    var calculations = {
        long: {
            noOfTrades: (0, common_calc_1.totalNoOfLongs)(accountData),
            result: (0, common_calc_2.totalLongsProfitLoss)(accountData),
            winRate: (0, common_calc_1.longsWonPercent)(accountData),
            aveProfit: aveLongsProfitLoss(accountData),
            rrr: longsRrr(accountData)
        },
        short: {
            noOfTrades: (0, common_calc_1.totalNoOfShorts)(accountData),
            result: (0, common_calc_2.totalShortsProfitLoss)(accountData),
            winRate: (0, common_calc_1.shortsWonPercent)(accountData),
            aveProfit: aveShortsProfitLoss(accountData),
            rrr: shortsRrr(accountData)
        }
    };
    return calculations;
};
var aveLongsProfitLoss = function (accountData) {
    var longsProfit = (0, common_calc_2.totalLongsProfitLoss)(accountData);
    var noOfLongs = (0, common_calc_1.totalNoOfLongs)(accountData);
    if (noOfLongs === 0)
        return 0;
    return longsProfit / noOfLongs;
};
var aveShortsProfitLoss = function (accountData) {
    var shortsProfit = (0, common_calc_2.totalShortsProfitLoss)(accountData);
    var noOfShorts = (0, common_calc_1.totalNoOfShorts)(accountData);
    if (noOfShorts === 0)
        return 0;
    return shortsProfit / noOfShorts;
};
/** @todo: calculate the risk reward ratio */
var longsRrr = function (accountData) {
    return 0;
};
/** @todo: calculate the risk reward ratio */
var shortsRrr = function (accountData) {
    return 0;
};
exports.default = longShortComparisonTableCalc;
//# sourceMappingURL=long-short-comp-table-calc.js.map