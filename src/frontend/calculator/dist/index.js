"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.periodAnalysisCalculations = exports.tradingTimeAnalysisCalculations = exports.pairsAnalysisCalculations = exports.longShortAnalysisCalculations = exports.expensesCalculations = exports.cashAndGainsCalculations = exports.overviewCalculations = void 0;
var overview_calculations_1 = __importDefault(require("./overview-calculations"));
exports.overviewCalculations = overview_calculations_1.default;
__exportStar(require("./overview-calculations/types"), exports);
__exportStar(require("./types"), exports);
var cash_and_gains_calculations_1 = __importDefault(require("./cash-and-gains-calculations"));
exports.cashAndGainsCalculations = cash_and_gains_calculations_1.default;
__exportStar(require("./cash-and-gains-calculations/types"), exports);
var expenses_calculations_1 = __importDefault(require("./expenses-calculations"));
exports.expensesCalculations = expenses_calculations_1.default;
__exportStar(require("./expenses-calculations/types"), exports);
var long_short_analysis_calculations_1 = __importDefault(require("./long-short-analysis-calculations"));
exports.longShortAnalysisCalculations = long_short_analysis_calculations_1.default;
__exportStar(require("./long-short-analysis-calculations/types"), exports);
var pairs_analysis_calculations_1 = __importDefault(require("./pairs-analysis-calculations"));
exports.pairsAnalysisCalculations = pairs_analysis_calculations_1.default;
__exportStar(require("./pairs-analysis-calculations/types"), exports);
var trading_time_analysis_calculations_1 = __importDefault(require("./trading-time-analysis-calculations"));
exports.tradingTimeAnalysisCalculations = trading_time_analysis_calculations_1.default;
__exportStar(require("./trading-time-analysis-calculations/types"), exports);
var period_analysis_calculations_1 = __importDefault(require("./period-analysis-calculations"));
exports.periodAnalysisCalculations = period_analysis_calculations_1.default;
__exportStar(require("./period-analysis-calculations/types"), exports);
//# sourceMappingURL=index.js.map