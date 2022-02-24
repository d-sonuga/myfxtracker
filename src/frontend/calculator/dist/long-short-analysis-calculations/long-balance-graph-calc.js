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
/**
 * Profit / loss of longs against an index no in which a trade having an index
 * number 1 implies that it was carried out before a trade with an index number 2
 */
var longBalanceGraphCalc = function (accountData) {
    var cummulativeResult = 0;
    var calculations = __spreadArray([
        { tradeNo: 0, result: 0 }
    ], accountData.trades
        .filter(function (trade) { return trade.action === 'buy'; })
        .map(function (trade, i) {
        cummulativeResult += trade.profitLoss;
        return {
            tradeNo: i + 1,
            result: cummulativeResult
        };
    }), true);
    return calculations;
};
exports.default = longBalanceGraphCalc;
//# sourceMappingURL=long-balance-graph-calc.js.map