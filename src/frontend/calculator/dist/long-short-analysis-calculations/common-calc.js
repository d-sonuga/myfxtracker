"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalShortsProfitLoss = exports.totalLongsProfitLoss = void 0;
/**
 * The total profit / loss gotten from all longs (trade.action = 'buy')
 * in accountData.trades
 * */
var totalLongsProfitLoss = function (accountData) {
    var totalProfitLoss = 0;
    for (var _i = 0, _a = accountData.trades; _i < _a.length; _i++) {
        var trade = _a[_i];
        if (trade.action === 'buy') {
            totalProfitLoss += trade.profitLoss;
        }
    }
    return totalProfitLoss;
};
exports.totalLongsProfitLoss = totalLongsProfitLoss;
/**
 * The total profit / loss gotten from all longs (trade.action = 'buy')
 * in accountData.trades
 * */
var totalShortsProfitLoss = function (accountData) {
    var totalProfitLoss = 0;
    for (var _i = 0, _a = accountData.trades; _i < _a.length; _i++) {
        var trade = _a[_i];
        if (trade.action === 'sell') {
            totalProfitLoss += trade.profitLoss;
        }
    }
    return totalProfitLoss;
};
exports.totalShortsProfitLoss = totalShortsProfitLoss;
//# sourceMappingURL=common-calc.js.map