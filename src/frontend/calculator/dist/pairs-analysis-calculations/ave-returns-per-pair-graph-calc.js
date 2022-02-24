"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aveReturnsPerPairGraphCalc = function (accountData) {
    // An object to get all the number of trades and profit / losses
    // for a pair, to calculate the average returns for that pair
    var perPairData = calcPerPairData(accountData);
    var calculations = calcGraphData(perPairData);
    return calculations;
};
/**
 * Turn the result from calcPerPairData into an array of AveReturnsPerPairGraphCalcItem
 * objects with a pair and the average returns associated with it
 */
var calcGraphData = function (perPairData) {
    // No need to check if the tradeNo is 0, because if can't be
    // The fact that the pair appears in this object implies that there must be at
    // least 1 trade that has this pair
    var aveReturns = function (pair) { return perPairData[pair].profitLoss / perPairData[pair].tradeNo; };
    return Object.keys(perPairData).map(function (pair) { return ({ pair: pair, result: aveReturns(pair) }); });
};
/**
 * Returns an object to get all the number of trades and profit / losses
 * for a pair, which will be used to calculate the average returns for that pair
*/
var calcPerPairData = function (accountData) {
    var perPairData = {};
    for (var _i = 0, _a = accountData.trades; _i < _a.length; _i++) {
        var trade = _a[_i];
        if (!(trade.pair in perPairData)) {
            perPairData[trade.pair] = { tradeNo: 0, profitLoss: 0 };
        }
        perPairData[trade.pair].tradeNo += 1;
        perPairData[trade.pair].profitLoss += trade.profitLoss;
    }
    return perPairData;
};
exports.default = aveReturnsPerPairGraphCalc;
//# sourceMappingURL=ave-returns-per-pair-graph-calc.js.map