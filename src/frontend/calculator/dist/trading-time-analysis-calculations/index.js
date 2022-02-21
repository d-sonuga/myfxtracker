"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var trade_duration_table_calc_1 = __importDefault(require("./trade-duration-table-calc"));
var open_hour_table_calc_1 = __importDefault(require("./open-hour-table-calc"));
var time_analysis_graph_calc_1 = __importDefault(require("./time-analysis-graph-calc"));
var tradingTimeAnalysisCalculations = function (accountData) {
    var calculations = {
        tradeDurationTableCalc: (0, trade_duration_table_calc_1.default)(accountData),
        openHourTableCalc: (0, open_hour_table_calc_1.default)(accountData),
        timeAnalysisGraphCalc: (0, time_analysis_graph_calc_1.default)(accountData)
    };
    return calculations;
};
exports.default = tradingTimeAnalysisCalculations;
//# sourceMappingURL=index.js.map