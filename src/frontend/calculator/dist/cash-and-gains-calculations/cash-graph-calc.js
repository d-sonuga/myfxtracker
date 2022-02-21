"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphCalc = void 0;
var utils_1 = require("../utils");
/**
 * For calculating the datasets for the Cash Graph on the
 * Cash And Gains page
 */
var cashGraphCalc = function (accountData, today) {
    if (today === void 0) { today = new Date(); }
    var calculations = {
        todayGraphCalc: todayGraphCalc(accountData, today),
        thisWeekGraphCalc: thisWeekGraphCalc(accountData, today),
        thisMonthGraphCalc: thisMonthGraphCalc(accountData, today),
        thisYearGraphCalc: thisYearGraphCalc(accountData, today),
        allTimeGraphCalc: allTimeGraphCalc(accountData, today)
    };
    return calculations;
};
var todayGraphCalc = function (accountData, today) {
    var accData = (0, utils_1.cloneObj)(accountData);
    accData.trades = accData.trades.filter(function (trade) { return ((0, utils_1.sameDay)(trade.closeTime, today)); });
    return graphCalc(accData);
};
var thisWeekGraphCalc = function (accountData, today) {
    var accData = (0, utils_1.cloneObj)(accountData);
    accData.trades = accData.trades.filter(function (trade) { return ((0, utils_1.sameWeek)(trade.closeTime, today)); });
    return graphCalc(accData);
};
var thisMonthGraphCalc = function (accountData, today) {
    var accData = (0, utils_1.cloneObj)(accountData);
    accData.trades = accData.trades.filter(function (trade) { return ((0, utils_1.sameMonth)(trade.closeTime, today)); });
    return graphCalc(accData);
};
var thisYearGraphCalc = function (accountData, today) {
    var accData = (0, utils_1.cloneObj)(accountData);
    accData.trades = accData.trades.filter(function (trade) { return ((0, utils_1.sameYear)(trade.closeTime, today)); });
    return graphCalc(accData);
};
var allTimeGraphCalc = function (accountData, today) {
    return graphCalc(accountData);
};
/**
 * The tradeNo is the trade index number
 * The balance is plotted against it
 * Initialize a running balance to 0
 * Initialize the tradesIndex, depositsIndex and withdrawalsIndex to 0
 * Iterate through the trades, deposits and withdrawals at the same time
 * Check for the one with the earliest date
 *  If it's the trade, add the trade to the running balance, increment the tradeIndex by 1
 *      and continue to the next iteration
 *  Else If it's the deposit, add the deposit to the running balance, increment the depositsIndex
 *      then check if the trade's date comes before the withdrawal's
 *      If the trade's date comes before the withdrawal's,
 *          add the trade to the running balance and continue to the next iteration
 *      Else If the withdrawal's date comes before the trade's date,
 *          subtract the withdrawal from the running balance and continue to the next iteration
 */
var graphCalc = function (accountData) {
    var tradesIndex = 0;
    var withdrawalsIndex = 0;
    var depositsIndex = 0;
    var currentTradeNo = 1;
    var currentBalance = 0;
    var calc = [{ tradeNo: 0, balance: 0 }];
    var _loop_1 = function () {
        var currentDeposit = accountData.deposits[depositsIndex];
        var currentWithdrawal = accountData.withdrawals[withdrawalsIndex];
        var currentTrade = accountData.trades[tradesIndex];
        var _a = getDatePos(currentDeposit, currentWithdrawal, currentTrade), depositPos = _a[0], withdrawalPos = _a[1], tradePos = _a[2];
        var tradeIsEarliest = function () { return tradePos === 1; };
        var withdrawalIsEarliest = function () { return withdrawalPos === 1; };
        var withdrawalIsSecond = function () { return withdrawalPos === 2; };
        var depositIsEarliest = function () { return depositPos === 1; };
        var depositIsSecond = function () { return depositPos === 2; };
        var addTradeToBalance = function () {
            currentBalance += currentTrade.profitLoss;
            tradesIndex += 1;
        };
        var decreaseWithdrawalFromBalance = function () {
            currentBalance -= currentWithdrawal.amount;
            withdrawalsIndex += 1;
        };
        var addDepositToBalance = function () {
            currentBalance += currentDeposit.amount;
            depositsIndex += 1;
        };
        // Trade is earliest        
        if (tradeIsEarliest()) {
            addTradeToBalance();
            // withdrawal on the same day
            if (withdrawalIsEarliest()) {
                decreaseWithdrawalFromBalance();
            }
            // deposit on the same day
            if (depositIsEarliest()) {
                addDepositToBalance();
            }
        }
        else if (depositIsEarliest()) {
            addDepositToBalance();
            if (withdrawalIsSecond()) {
                decreaseWithdrawalFromBalance();
            }
            // At this point, trade can only be the 3rd
            addTradeToBalance();
        }
        else {
            // At this point, only the withdrawal can be the earliest
            decreaseWithdrawalFromBalance();
            if (depositIsSecond()) {
                addDepositToBalance();
            }
            addTradeToBalance();
        }
        calc.push({ tradeNo: currentTradeNo, balance: currentBalance });
        currentTradeNo += 1;
    };
    while (tradesIndex !== accountData.trades.length) {
        _loop_1();
    }
    return calc;
};
exports.graphCalc = graphCalc;
/**
 * Returns a triple with each slot holding the position of the trade, deposit and withdrawal
 * indicating which took place the earliest, second earliest and latest.
 * For example, if the deposit has the earliest date, withdrawal with the second earliest and
 * trade with the latest, what will be returned will look like this:
 * [1, 2, 3], because the deposit is the first earliest, the withdrawal is the second earliest
 * and the trade is the latest.
 * The positions in the triple are arranged in that order: deposits position, withdrawal's
 * position and trade's position
 * */
var getDatePos = function (deposit, withdrawal, trade) {
    var depositDate = deposit === undefined ? new Date(utils_1.FAR_IN_THE_FUTURE_YEAR, 11, 31)
        : new Date(deposit.time);
    var withdrawalDate = withdrawal === undefined ? new Date(utils_1.FAR_IN_THE_FUTURE_YEAR, 10, 30)
        : new Date(withdrawal.time);
    var tradeDate = new Date(trade.closeTime);
    var posTriple = [-1, -1, -1];
    // Their indexes in the posTriple
    var DEPOSIT = 0;
    var WITHDRAWAL = 1;
    var TRADE = 2;
    // Their positions
    var UNSET = -1;
    var FIRST = 1;
    var SECOND = 2;
    var THIRD = 3;
    // To check if a slot in the posTriple has already been set
    var posAlreadySet = function (pos) { return pos !== -1; };
    var tradeDateIsEarliest = function () { return tradeDate <= depositDate && tradeDate <= withdrawalDate; };
    var depositDateIsEarliest = function () { return depositDate <= tradeDate && depositDate <= withdrawalDate; };
    var withdrawalDateIsEarliest = function () { return withdrawalDate <= tradeDate && withdrawalDate <= depositDate; };
    var sameDate = function (date1, date2) { return date1 === date2; };
    /**
     * possible positions:
     *  trade, deposit, withdrawal
     *  trade, withdrawal, deposit
     *  deposit, trade, withdrawal
     *  deposit, withdrawal, trade
     *  withdrawal, deposit, trade
     *  withdrawal, trade, deposit
     * There is also a possibility that any of the dates may be the same
     */
    if (tradeDateIsEarliest()) {
        posTriple[TRADE] = FIRST;
        posTriple[DEPOSIT] = sameDate(tradeDate, depositDate) ? FIRST : UNSET;
        posTriple[WITHDRAWAL] = sameDate(tradeDate, withdrawalDate) ? FIRST : UNSET;
        // At this point, the positions of deposit and withdrawal don't matter
        // because as long as trade comes first, the only other things that
        // need to be checked are if the deposits and withdrawals have the same position
    }
    else if (depositDateIsEarliest()) {
        posTriple[DEPOSIT] = FIRST;
        posTriple[TRADE] = sameDate(tradeDate, depositDate) ? FIRST : UNSET;
        posTriple[WITHDRAWAL] = sameDate(withdrawalDate, depositDate) ? FIRST : UNSET;
        if (tradeDate <= withdrawalDate) {
            /**
             * Checking if the position is already set to consider the scenario
             * where tradeDate is equal to depositDate, and its position is already 1st
             */
            posTriple[TRADE] = posAlreadySet(TRADE) ? posTriple[TRADE] : SECOND;
            /**
             * If withdrawal's position is already set, that means withdrawalDate is
             * equal to depositDate and so, the date is already 1st
             */
            if (sameDate(tradeDate, withdrawalDate)) {
                posTriple[WITHDRAWAL] = posAlreadySet(WITHDRAWAL) ? posTriple[WITHDRAWAL] : SECOND;
            }
            else {
                /**
                 * If tradeDate comes before withdrawalDate, then it's not possible for
                 * withdrawal's position to have been set. If withdrawal's position was
                 * set, then it must be equal to depositDate, which is the earliest, but
                 * if it was equal to depositDate, then tradeDate could not have come before
                 * it, so the code here would never have been reached
                 */
                posTriple[WITHDRAWAL] = THIRD;
            }
        }
        else {
            /**
             * At this point, withdrawalDate is sure to be before tradeDate
             */
            posTriple[TRADE] = THIRD;
            posTriple[WITHDRAWAL] = SECOND;
        }
    }
    else if (withdrawalDateIsEarliest()) {
        posTriple[WITHDRAWAL] = FIRST;
        posTriple[TRADE] = sameDate(tradeDate, withdrawalDate) ? FIRST : UNSET;
        posTriple[DEPOSIT] = sameDate(depositDate, withdrawalDate) ? FIRST : UNSET;
        if (tradeDate <= depositDate) {
            /**
             * Checking if the position is already set to consider the scenario
             * where tradeDate is equal to withdrawalDate, and its position is already 1st
             */
            posTriple[TRADE] = posAlreadySet(TRADE) ? posTriple[TRADE] : SECOND;
            /**
             * If deposit's position is already set, that means withdrawalDate is
             * equal to depositDate and so, the date is already 1st
             */
            if (sameDate(tradeDate, depositDate)) {
                posTriple[DEPOSIT] = posAlreadySet(DEPOSIT) ? posTriple[DEPOSIT] : SECOND;
            }
            else {
                /**
                 * If tradeDate comes before depositDate, then it's not possible for
                 * deposit's position to have been set. If deposit's position was
                 * set, then it must be equal to withdrawalDate, which is the earliest, but
                 * if it was equal to withdrawalDate, then tradeDate could not have come before
                 * it, so the code here would never have been reached
                 */
                posTriple[DEPOSIT] = THIRD;
            }
        }
        else {
            /**
             * At this point, depositDate is sure to be before tradeDate
             */
            posTriple[TRADE] = THIRD;
            posTriple[DEPOSIT] = SECOND;
        }
    }
    return posTriple;
};
exports.default = cashGraphCalc;
//# sourceMappingURL=cash-graph-calc.js.map