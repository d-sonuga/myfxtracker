"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_calc_1 = require("../common-calc");
var utils_1 = require("./utils");
var pairsAnalysisTableCalc = function (accountData) {
    var tradesPerPair = (0, utils_1.groupTradesByPair)(accountData);
    return Object.keys(tradesPerPair).map(function (pair) {
        var trades = tradesPerPair[pair];
        return {
            pair: pair,
            noOfTradesOnPair: trades.length,
            noOfProfitableTradesOnPair: (0, common_calc_1.totalNoOfWinningTrades)(trades),
            profitableTradesOnPairPercent: (0, common_calc_1.winRate)(trades),
            noOfLosingTradesOnPair: noOfLosingTrades(trades),
            losingTradesOnPairPercent: loseRate(trades),
            noOfShortsOnPair: (0, common_calc_1.totalNoOfShorts)(trades),
            shortsOnPairPercent: shortsOnPairPercent(trades),
            noOfLongsOnPair: (0, common_calc_1.totalNoOfLongs)(trades),
            longsOnPairPercent: longsOnPairPercent(trades),
            noOfTpOnPair: noOfTpOnPair(trades),
            tpOnPairPercent: tpOnPairPercent(trades),
            noOfSlOnPair: noOfSlOnPair(trades),
            slOnPairPercent: slOnPairPercent(trades)
        };
    });
};
var longsOnPairPercent = function (trades) {
    var noOfShorts = (0, common_calc_1.totalNoOfLongs)(trades);
    var totalNoOfTrades = (0, common_calc_1.noOfTrades)(trades);
    if (totalNoOfTrades === 0)
        return 0;
    return (noOfShorts / totalNoOfTrades) * 100;
};
var shortsOnPairPercent = function (trades) {
    var noOfShorts = (0, common_calc_1.totalNoOfShorts)(trades);
    var totalNoOfTrades = (0, common_calc_1.noOfTrades)(trades);
    if (totalNoOfTrades === 0)
        return 0;
    return (noOfShorts / totalNoOfTrades) * 100;
};
var noOfLosingTrades = function (trades) {
    var lossTrades = trades.filter(function (trade) { return trade.profitLoss < 0; });
    return lossTrades.length;
};
var loseRate = function (trades) {
    var lossTrades = noOfLosingTrades(trades);
    var totalNoOfTrades = (0, common_calc_1.noOfTrades)(trades);
    if (totalNoOfTrades === 0)
        return 0;
    return (lossTrades / totalNoOfTrades) * 100;
};
var noOfTpOnPair = function (trades) {
    var tpOnPair = 0;
    trades.forEach(function (trade) {
        tpOnPair += trade.takeProfit;
    });
    return tpOnPair;
};
var noOfSlOnPair = function (trades) {
    var slOnPair = 0;
    trades.forEach(function (trade) {
        slOnPair += trade.stopLoss;
    });
    return slOnPair;
};
var tpOnPairPercent = function (trades) {
    var tpOnPair = 0;
    var count = 0;
    trades.forEach(function (trade) {
        tpOnPair += trade.takeProfit;
        count++;
    });
    return tpOnPair / count;
};
var slOnPairPercent = function (trades) {
    var slOnPair = 0;
    var count = 0;
    trades.forEach(function (trade) {
        slOnPair += trade.stopLoss;
        count++;
    });
    return slOnPair / count;
};
exports.default = pairsAnalysisTableCalc;
//# sourceMappingURL=pairs-analysis-table-calc.js.map