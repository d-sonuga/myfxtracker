"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var long_short_comp_table_calc_1 = __importDefault(require("./long-short-comp-table-calc"));
var long_short_comp_graph_calc_1 = __importDefault(require("./long-short-comp-graph-calc"));
var long_balance_graph_calc_1 = __importDefault(require("./long-balance-graph-calc"));
var short_balance_graph_calc_1 = __importDefault(require("./short-balance-graph-calc"));
var longShortAnalysisCalculations = function (accountData) {
    var calculations = {
        longShortComparisonTableCalc: (0, long_short_comp_table_calc_1.default)(accountData),
        longShortComparisonGraphCalc: (0, long_short_comp_graph_calc_1.default)(accountData),
        longBalanceGraphCalc: (0, long_balance_graph_calc_1.default)(accountData),
        shortBalanceGraphCalc: (0, short_balance_graph_calc_1.default)(accountData)
    };
    return calculations;
};
exports.default = longShortAnalysisCalculations;
//# sourceMappingURL=index.js.map