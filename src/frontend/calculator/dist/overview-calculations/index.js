"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aveRRR = void 0;
var overview_cards_calc_1 = __importDefault(require("./overview-cards-calc"));
var overview_stats_calc_1 = __importDefault(require("./overview-stats-calc"));
var weekly_summary_calc_1 = __importDefault(require("./weekly-summary-calc"));
var account_returns_graph_calc_1 = __importDefault(require("./account-returns-graph-calc"));
var overviewCalculations = function (accountData) {
    var calculations = {
        cardsCalc: (0, overview_cards_calc_1.default)(accountData),
        statsCalc: (0, overview_stats_calc_1.default)(accountData),
        weeklySummaryCalc: (0, weekly_summary_calc_1.default)(accountData),
        accountReturnsGraphCalc: (0, account_returns_graph_calc_1.default)(accountData)
    };
    return calculations;
};
exports.default = overviewCalculations;
var overview_stats_calc_2 = require("./overview-stats-calc");
Object.defineProperty(exports, "aveRRR", { enumerable: true, get: function () { return overview_stats_calc_2.aveRRR; } });
//# sourceMappingURL=index.js.map