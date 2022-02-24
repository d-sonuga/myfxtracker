"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ave_returns_per_pair_graph_calc_1 = __importDefault(require("./ave-returns-per-pair-graph-calc"));
var ave_rrr_per_pair_graph_calc_1 = __importDefault(require("./ave-rrr-per-pair-graph-calc"));
var pairs_analysis_table_calc_1 = __importDefault(require("./pairs-analysis-table-calc"));
var pairsAnalysisCalculations = function (accountData) {
    var calculations = {
        aveReturnsPerPairGraphCalc: (0, ave_returns_per_pair_graph_calc_1.default)(accountData),
        aveRrrPerPairGraphCalc: (0, ave_rrr_per_pair_graph_calc_1.default)(accountData),
        pairsAnalysisTableCalc: (0, pairs_analysis_table_calc_1.default)(accountData)
    };
    return calculations;
};
exports.default = pairsAnalysisCalculations;
//# sourceMappingURL=index.js.map