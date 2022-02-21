"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aveRRR = void 0;
var common_calc_1 = require("../common-calc");
var cash_and_gains_calculations_1 = require("../cash-and-gains-calculations");
var common_calc_2 = require("../common-calc");
var statsCalc = function (accountData) {
    var calculations = {
        aveProfit: aveProfit(accountData),
        aveLoss: aveLoss(accountData),
        longsWonPercent: (0, common_calc_2.longsWonPercent)(accountData),
        noOfLongsWon: (0, common_calc_2.totalNoOfLongsWon)(accountData),
        noOfLongs: (0, common_calc_2.totalNoOfLongs)(accountData),
        shortsWonPercent: (0, common_calc_2.shortsWonPercent)(accountData),
        noOfShortsWon: (0, common_calc_2.totalNoOfShortsWon)(accountData),
        noOfShorts: (0, common_calc_2.totalNoOfShorts)(accountData),
        bestTrade: bestTrade(accountData),
        worstTrade: worstTrade(accountData),
        highestBalance: highestBalance(accountData),
        aveRRR: aveRRR(accountData),
        profitFactor: profitFactor(accountData),
        expectancy: expectancy(accountData),
        lots: totalLots(accountData),
        commissions: totalCommissions(accountData)
    };
    return calculations;
};
var aveProfit = function (accountData) {
    var profit = totalProfit(accountData);
    var noOfWinningTrades = (0, common_calc_1.totalNoOfWinningTrades)(accountData);
    if (noOfWinningTrades === 0)
        return 0;
    return profit / noOfWinningTrades;
};
var totalProfit = function (data) {
    var totalProfit = 0;
    var trades;
    if (Array.isArray(data)) {
        trades = data;
    }
    else {
        trades = data.trades;
    }
    for (var _i = 0, trades_1 = trades; _i < trades_1.length; _i++) {
        var trade = trades_1[_i];
        if (trade.profitLoss > 0) {
            totalProfit += trade.profitLoss;
        }
    }
    return totalProfit;
};
var aveLoss = function (data) {
    // Multiplying by -1 to remove the negative sign
    // When displayed, it should be -$loss, not -$-loss
    var loss = totalLoss(data) * -1;
    var noOfLosingTrades = totalNoOfLosingTrades(data);
    if (noOfLosingTrades === 0)
        return 0;
    return loss / noOfLosingTrades;
};
var totalLoss = function (data) {
    var totalLoss = 0;
    var trades;
    if (Array.isArray(data)) {
        trades = data;
    }
    else {
        trades = data.trades;
    }
    for (var _i = 0, trades_2 = trades; _i < trades_2.length; _i++) {
        var trade = trades_2[_i];
        if (trade.profitLoss < 0) {
            totalLoss += trade.profitLoss;
        }
    }
    return totalLoss;
};
var totalNoOfLosingTrades = function (data) {
    var noOfLosingTrades = 0;
    var trades;
    if (Array.isArray(data)) {
        trades = data;
    }
    else {
        trades = data.trades;
    }
    for (var _i = 0, trades_3 = trades; _i < trades_3.length; _i++) {
        var trade = trades_3[_i];
        if (trade.profitLoss < 0) {
            noOfLosingTrades += 1;
        }
    }
    return noOfLosingTrades;
};
/** Trade with highest profit */
var bestTrade = function (accountData) {
    if (accountData.trades.length === 0)
        return 0;
    var bestTrade = accountData.trades[0].profitLoss;
    for (var _i = 0, _a = accountData.trades; _i < _a.length; _i++) {
        var trade = _a[_i];
        if (trade.profitLoss > bestTrade) {
            bestTrade = trade.profitLoss;
        }
    }
    return bestTrade;
};
/** Trade with the lowest profit (or loss) */
var worstTrade = function (accountData) {
    if (accountData.trades.length === 0)
        return 0;
    var worstTrade = accountData.trades[0].profitLoss;
    for (var _i = 0, _a = accountData.trades; _i < _a.length; _i++) {
        var trade = _a[_i];
        if (trade.profitLoss < worstTrade) {
            worstTrade = trade.profitLoss;
        }
    }
    return worstTrade;
};
var highestBalance = function (accountData) {
    var balanceData = (0, cash_and_gains_calculations_1.graphCalc)(accountData);
    var highestBalance = -Infinity;
    balanceData.forEach(function (data) {
        if (data.balance > highestBalance) {
            highestBalance = data.balance;
        }
    });
    return highestBalance;
};
var aveRRR = function (data) {
    var profit = aveProfit(data);
    var loss = aveLoss(data);
    if (profit === 0 && loss === 0)
        return 0;
    return profit / loss;
};
exports.aveRRR = aveRRR;
var profitFactor = function (accountData) {
    // What should be returned when loss is 0?
    var profit = totalProfit(accountData);
    var loss = totalLoss(accountData);
    if (profit === 0 && loss === 0)
        return 0;
    return profit / loss;
};
var expectancy = function (accountData) {
    var winrate = (0, common_calc_1.winRate)(accountData);
    return ((aveProfit(accountData) * winrate) - (aveLoss(accountData) * (100 - winrate)));
};
var totalLots = function (accountData) {
    var totalLots = 0;
    for (var _i = 0, _a = accountData.trades; _i < _a.length; _i++) {
        var trade = _a[_i];
        if (trade.lots) {
            totalLots += trade.lots;
        }
    }
    return totalLots;
};
var totalCommissions = function (accountData) {
    var totalCommissions = 0;
    for (var _i = 0, _a = accountData.trades; _i < _a.length; _i++) {
        var trade = _a[_i];
        if (trade.swap) {
            totalCommissions += trade.swap;
        }
        if (trade.commission) {
            totalCommissions += trade.commission;
        }
    }
    return totalCommissions;
};
exports.default = statsCalc;
//# sourceMappingURL=overview-stats-calc.js.map