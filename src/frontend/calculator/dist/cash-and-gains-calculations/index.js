"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphCalc = void 0;
var cash_graph_calc_1 = __importDefault(require("./cash-graph-calc"));
var gains_graph_calc_1 = __importDefault(require("./gains-graph-calc"));
var cashAndGainsCalculations = function (accountData) {
    var calculations = {
        cashGraphCalc: (0, cash_graph_calc_1.default)(accountData),
        gainsGraphCalc: (0, gains_graph_calc_1.default)(accountData)
    };
    return calculations;
};
exports.default = cashAndGainsCalculations;
var cash_graph_calc_2 = require("./cash-graph-calc");
Object.defineProperty(exports, "graphCalc", { enumerable: true, get: function () { return cash_graph_calc_2.graphCalc; } });
//# sourceMappingURL=index.js.map