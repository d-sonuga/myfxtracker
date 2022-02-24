"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_calc_1 = require("./common-calc");
/**
 * Returns an array of 2 items, 1 containing the profit / loss (result)
 * of all longs and the other containing the result of all shorts
 */
var longShortComparisonGraphCalc = function (accountData) {
    var calculations = [
        { label: 'long', result: (0, common_calc_1.totalLongsProfitLoss)(accountData) },
        { label: 'short', result: (0, common_calc_1.totalShortsProfitLoss)(accountData) }
    ];
    return calculations;
};
exports.default = longShortComparisonGraphCalc;
//# sourceMappingURL=long-short-comp-graph-calc.js.map