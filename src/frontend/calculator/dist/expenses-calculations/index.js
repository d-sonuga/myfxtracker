"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var expenses_table_calc_1 = __importDefault(require("./expenses-table-calc"));
var expensesCalculations = function (accountData) {
    var calculations = {
        expensesTableCalc: (0, expenses_table_calc_1.default)(accountData)
    };
    return calculations;
};
exports.default = expensesCalculations;
//# sourceMappingURL=index.js.map