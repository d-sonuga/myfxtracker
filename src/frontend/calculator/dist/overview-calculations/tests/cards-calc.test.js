"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var overview_cards_calc_1 = __importDefault(require("../overview-cards-calc"));
var utils_1 = require("../../utils");
describe('Verify that overviewCardsCalc is working', function () {
    describe('When accountData.trades is empty', function () {
        var dummyDeposits = [];
        var dummyWithdrawals = [];
        var trades = [];
        var dummyAccountData = {
            name: 'dummy account',
            deposits: dummyDeposits,
            withdrawals: dummyWithdrawals,
            trades: trades
        };
        var result = (0, overview_cards_calc_1.default)(dummyAccountData);
        var expectedResult = {
            totalBalance: 0,
            noOfTrades: 0,
            winRate: 0,
            absGain: 0
        };
        test('it outputs all calc fields as 0', function () {
            expect(result).toEqual(expectedResult);
        });
    });
    describe('When accountData.trades is not empty', function () {
        describe('When only 1 trade has been taken', function () {
            var depositAmount = 300;
            var withdrawalAmount = 140;
            var tradeProfitLoss = 430;
            var dummyDateStr = '2022-12-03T18:34:00Z';
            var dummyDeposits = [
                { account: 1, amount: depositAmount, time: dummyDateStr }
            ];
            var dummyWithdrawals = [
                { account: 1, amount: withdrawalAmount, time: dummyDateStr }
            ];
            var trades = [
                {
                    pair: 'GBPJPY',
                    action: 'buy',
                    openTime: '2022-12-03T18:34:00Z',
                    closeTime: '2022-12-03T18:34:00Z',
                    riskRewardRatio: 3.4,
                    profitLoss: tradeProfitLoss,
                    pips: 3,
                    notes: '',
                    entryImageLink: '',
                    exitImageLink: '',
                    lots: 3,
                    commission: 34,
                    swap: 43,
                    stopLoss: 0,
                    takeProfit: 0,
                    openPrice: 0,
                    closePrice: 0
                }
            ];
            var dummyAccountData = {
                name: 'dummy account',
                deposits: dummyDeposits,
                withdrawals: dummyWithdrawals,
                trades: trades
            };
            var totalExpenses = (trades[0].commission ? trades[0].commission : 0)
                + (trades[0].swap ? trades[0].swap : 0);
            var result = (0, overview_cards_calc_1.default)(dummyAccountData);
            var expectedResult = {
                totalBalance: tradeProfitLoss + depositAmount - withdrawalAmount - totalExpenses,
                noOfTrades: 1,
                winRate: 100,
                absGain: (tradeProfitLoss / depositAmount) * 100
            };
            test('correct field values are outputted', function () {
                expect(result).toEqual(expectedResult);
            });
        });
        describe('When many trades have been taken', function () {
            // Changed when populating the tradeProfitLosses array
            var generateRandomAmounts = function (noNegative) {
                if (noNegative === void 0) { noNegative = false; }
                var randomAmount = function (magnitude, sign) {
                    // bigger numbers for bigger magnitudes
                    // -1 for negative sign, 1 for positive sign
                    return magnitude * Math.random() * sign;
                };
                var amountSetNo = 100000;
                var amounts = [];
                var sign = 1;
                var magnitude = 1;
                for (var i = 0; i < amountSetNo; i++) {
                    if (i === 1000) {
                        magnitude = 1000;
                    }
                    else if (i === 100000) {
                        magnitude = 1000000;
                    }
                    else if (i === 1000000) {
                        magnitude = 1000000000;
                    }
                    if (i % 2 === 1) {
                        sign = noNegative ? 1 : -1;
                    }
                    else {
                        sign = 1;
                    }
                    amounts.push(randomAmount(magnitude, sign));
                }
                return amounts;
            };
            var sum = function (array) {
                var sum = 0;
                for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
                    var i = array_1[_i];
                    sum += i;
                }
                return sum;
            };
            var depositAmounts = generateRandomAmounts();
            var withdrawalAmounts = generateRandomAmounts(false);
            var tradeProfitLosses = generateRandomAmounts();
            var noOfWinningTrades = tradeProfitLosses.filter(function (amount) { return amount >= 0; }).length;
            // the date is unimportant in this test
            var dummyDateStr = '2022-12-03T18:34:00Z';
            // build the data set of deposits, withdrawals and trades
            var dummyDeposits = depositAmounts.map(function (depositAmount) { return ({ account: 1, amount: depositAmount, time: dummyDateStr }); });
            var dummyWithdrawals = withdrawalAmounts.map(function (withdrawalAmount) { return ({ account: 1, amount: withdrawalAmount, time: dummyDateStr }); });
            var trades = tradeProfitLosses.map(function (tradeProfitLoss) { return ({
                pair: 'GBPJPY',
                action: 'buy',
                openTime: '2022-12-03T18:34:00Z',
                closeTime: '2022-12-03T18:34:00Z',
                riskRewardRatio: 3.4,
                profitLoss: tradeProfitLoss,
                pips: 3,
                notes: '',
                entryImageLink: '',
                exitImageLink: '',
                lots: 3,
                commission: Math.round((0, utils_1.randomNumber)(0, 50)),
                swap: Math.round((0, utils_1.randomNumber)(0, 50)),
                stopLoss: 0,
                takeProfit: 0,
                openPrice: 0,
                closePrice: 0
            }); });
            var dummyAccountData = {
                name: 'dummy account',
                deposits: dummyDeposits,
                withdrawals: dummyWithdrawals,
                trades: trades
            };
            var totalExpenses = (function () {
                var expenses = 0;
                trades.forEach(function (trade) {
                    expenses += (trade.commission ? trade.commission : 0) +
                        (trade.swap ? trade.swap : 0);
                });
                return expenses;
            })();
            var result = (0, overview_cards_calc_1.default)(dummyAccountData);
            var expectedResult = {
                totalBalance: sum(tradeProfitLosses) + sum(depositAmounts) - sum(withdrawalAmounts)
                    - totalExpenses,
                noOfTrades: tradeProfitLosses.length,
                winRate: (noOfWinningTrades / tradeProfitLosses.length) * 100,
                absGain: (sum(tradeProfitLosses) / sum(depositAmounts)) * 100
            };
            test('correct field values are outputted', function () {
                expect(result).toEqual(expectedResult);
            });
        });
    });
});
//# sourceMappingURL=cards-calc.test.js.map