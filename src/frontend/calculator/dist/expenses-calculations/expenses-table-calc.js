"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var expensesTableCalc = function (accountData) {
    var expensesPerPair = calcExpensesPerPair(accountData);
    var calculations = Object.keys(expensesPerPair)
        .map(function (pair) { return ({
        pair: pair,
        commission: expensesPerPair[pair].commissions,
        swap: expensesPerPair[pair].swap
    }); });
    return calculations;
};
var calcExpensesPerPair = function (accountData) {
    var expensesPerPair = {};
    for (var _i = 0, _a = accountData.trades; _i < _a.length; _i++) {
        var trade = _a[_i];
        if (!(trade.pair in expensesPerPair)) {
            expensesPerPair[trade.pair] = { commissions: 0, swap: 0 };
        }
        expensesPerPair[trade.pair].commissions +=
            trade.commission !== undefined ? trade.commission : 0;
        expensesPerPair[trade.pair].swap +=
            trade.swap !== undefined ? trade.swap : 0;
    }
    return expensesPerPair;
};
exports.default = expensesTableCalc;
//# sourceMappingURL=expenses-table-calc.js.map