"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupTradesByPair = void 0;
var groupTradesByPair = function (accountData) {
    var tradesPerPair = {};
    for (var _i = 0, _a = accountData.trades; _i < _a.length; _i++) {
        var trade = _a[_i];
        if (!(trade.pair in tradesPerPair)) {
            tradesPerPair[trade.pair] = [];
        }
        tradesPerPair[trade.pair].push(trade);
    }
    return tradesPerPair;
};
exports.groupTradesByPair = groupTradesByPair;
//# sourceMappingURL=utils.js.map