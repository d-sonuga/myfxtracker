"use strict";
/**
 * Functions for calculating the info on the overview cards
 */
Object.defineProperty(exports, "__esModule", { value: true });
var common_calc_1 = require("../common-calc");
var overviewCardsCalc = function (accountData) {
    var calculations = {
        totalBalance: totalBalance(accountData),
        winRate: (0, common_calc_1.winRate)(accountData),
        noOfTrades: (0, common_calc_1.noOfTrades)(accountData),
        absGain: absGain(accountData)
    };
    return calculations;
};
/**
 * To calculate the total balance of the account
 * Adds all profits, losses (always negative), deposits and subtracts withdrawals
 * */
var totalBalance = function (accountData) {
    var totalBalance = totalProfitLoss(accountData) + totalDeposits(accountData)
        - totalWithdrawals(accountData) - totalExpenses(accountData);
    return totalBalance;
};
/** Sums all profit and losses */
var totalProfitLoss = function (accountData) {
    var totalProfitLoss = 0;
    for (var _i = 0, _a = accountData.trades; _i < _a.length; _i++) {
        var trade = _a[_i];
        totalProfitLoss += trade.profitLoss;
    }
    return totalProfitLoss;
};
/** Sums all deposits */
var totalDeposits = function (accountData) {
    var totalDeposits = 0;
    for (var _i = 0, _a = accountData.deposits; _i < _a.length; _i++) {
        var deposit = _a[_i];
        totalDeposits += deposit.amount;
    }
    return totalDeposits;
};
/** Sums all withdrawals */
var totalWithdrawals = function (accountData) {
    var totalWithdrawals = 0;
    for (var _i = 0, _a = accountData.withdrawals; _i < _a.length; _i++) {
        var withdrawal = _a[_i];
        totalWithdrawals += withdrawal.amount;
    }
    return totalWithdrawals;
};
/**
 * Calculates total profit and loss divided by total deposits
 * expressed as a precentage
 */
var absGain = function (accountData) {
    var profitLoss = totalProfitLoss(accountData);
    var deposits = totalDeposits(accountData);
    if (deposits === 0)
        return 0;
    return (profitLoss / deposits) * 100;
};
var totalExpenses = function (accountData) {
    var expenses = 0;
    for (var _i = 0, _a = accountData.trades; _i < _a.length; _i++) {
        var trade = _a[_i];
        if (trade.commission) {
            expenses += trade.commission;
        }
        if (trade.swap) {
            expenses += trade.swap;
        }
    }
    return expenses;
};
exports.default = overviewCardsCalc;
//# sourceMappingURL=overview-cards-calc.js.map