"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var overview_calculations_1 = require("../overview-calculations");
var utils_1 = require("./utils");
var aveRrrPerPairGraphCalc = function (accountData) {
    var pairToTradesMap = (0, utils_1.groupTradesByPair)(accountData);
    return Object.keys(pairToTradesMap).map(function (pair) { return ({
        pair: pair,
        rrr: (0, overview_calculations_1.aveRRR)(pairToTradesMap[pair])
    }); });
};
exports.default = aveRrrPerPairGraphCalc;
//# sourceMappingURL=ave-rrr-per-pair-graph-calc.js.map