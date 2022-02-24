"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var returns_per_period_graph_calc_1 = __importDefault(require("./returns-per-period-graph-calc"));
var periodAnalysisCalculations = function (accountData) {
    var calculations = {
        returnsPerPeriodGraphCalc: (0, returns_per_period_graph_calc_1.default)(accountData)
    };
    return calculations;
};
exports.default = periodAnalysisCalculations;
//# sourceMappingURL=index.js.map