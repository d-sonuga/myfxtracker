"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../utils");
var gains_graph_calc_1 = __importDefault(require("../gains-graph-calc"));
describe('Verify gainsGraphCalc is working', function () {
    /** To create a new trade object without having to specify all trade attributes */
    var newTrade = function (attr) {
        return {
            profitLoss: (0, utils_1.randomNumber)(-1000000, 1000000),
            openTime: attr.date !== undefined ? attr.date : '2021-10-18T18:34:00Z',
            closeTime: attr.date !== undefined ? attr.date : '2021-10-18T18:34:00Z',
            pair: 'GBPUSD',
            action: 'buy',
            riskRewardRatio: 2,
            stopLoss: 0,
            takeProfit: 0,
            openPrice: 0,
            closePrice: 0
        };
    };
    describe('When there are no trades or deposits', function () {
        var accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: []
        };
        var result = (0, gains_graph_calc_1.default)(accountData);
        var defaultGraphItems = [{ tradeNo: 0, gainsPercent: 0 }];
        var expectedResult = {
            todayGraphCalc: defaultGraphItems,
            thisWeekGraphCalc: defaultGraphItems,
            thisMonthGraphCalc: defaultGraphItems,
            thisYearGraphCalc: defaultGraphItems,
            allTimeGraphCalc: defaultGraphItems
        };
        test('it outputs the default output', function () {
            expect(result).toEqual(expectedResult);
        });
    });
    describe('When there are only withdrawals', function () {
        var withdrawals = (function (numberOfWithdrawals) {
            var withdrawals = [];
            for (var i = numberOfWithdrawals; i > 0; i--) {
                withdrawals.push({
                    account: 2,
                    amount: (0, utils_1.randomNumber)(-1000000, 1000000),
                    time: '2021-10-12T18:34:00Z'
                });
            }
            return withdrawals;
        })(20);
        var accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: withdrawals,
            trades: []
        };
        var result = (0, gains_graph_calc_1.default)(accountData);
        var defaultGraphItems = [{ tradeNo: 0, gainsPercent: 0 }];
        var expectedResult = {
            todayGraphCalc: defaultGraphItems,
            thisWeekGraphCalc: defaultGraphItems,
            thisMonthGraphCalc: defaultGraphItems,
            thisYearGraphCalc: defaultGraphItems,
            allTimeGraphCalc: defaultGraphItems
        };
        test('it outputs the default output', function () {
            expect(result).toEqual(expectedResult);
        });
    });
    describe('When there are only deposits', function () {
        var deposits = (function (numberOfWithdrawals) {
            var deposits = [];
            for (var i = numberOfWithdrawals; i > 0; i--) {
                deposits.push({
                    account: 2,
                    amount: (0, utils_1.randomNumber)(-1000000, 1000000),
                    time: '2021-10-12T18:34:00Z'
                });
            }
            return deposits;
        })(20);
        var accountData = {
            name: 'dummy account',
            deposits: deposits,
            withdrawals: [],
            trades: []
        };
        var result = (0, gains_graph_calc_1.default)(accountData);
        var defaultGraphItems = [{ tradeNo: 0, gainsPercent: 0 }];
        var expectedResult = {
            todayGraphCalc: defaultGraphItems,
            thisWeekGraphCalc: defaultGraphItems,
            thisMonthGraphCalc: defaultGraphItems,
            thisYearGraphCalc: defaultGraphItems,
            allTimeGraphCalc: defaultGraphItems
        };
        test('it outputs the default output', function () {
            expect(result).toEqual(expectedResult);
        });
    });
    describe('When there are trades and deposits', function () {
        var tradeDateStr = '2021-10-13T18:34:00Z';
        var today = new Date(tradeDateStr);
        var noOfTrades = 20;
        // All deposits happen on 12th October, 2021
        var deposits = (function (numberOfDeposits) {
            var deposits = [];
            for (var i = numberOfDeposits; i > 0; i--) {
                deposits.push({ account: 2, amount: (0, utils_1.randomNumber)(-10000000, 100000000), time: '2021-10-12T18:34:00Z' });
            }
            return deposits;
        })(noOfTrades);
        // All trades happen on 13th October, 2021 (today)
        var trades = (function (numberOfTrades) {
            var trades = [];
            for (var i = numberOfTrades; i > 0; i--) {
                trades.push(newTrade({ date: tradeDateStr }));
            }
            return trades;
        })(noOfTrades);
        var accountData = {
            name: 'dummy account',
            deposits: deposits,
            withdrawals: [],
            trades: trades
        };
        var totalDeposits = (0, utils_1.sumObjArray)(deposits, 'amount');
        var expectedResultGainsGraphItems = __spreadArray([
            { tradeNo: 0, gainsPercent: 0 }
        ], trades.map(function (trade, i) { return ({
            tradeNo: i + 1,
            gainsPercent: (trade.profitLoss / totalDeposits) * 100
        }); }), true);
        var result = (0, gains_graph_calc_1.default)(accountData, today);
        var expectedResult = {
            todayGraphCalc: expectedResultGainsGraphItems,
            thisWeekGraphCalc: expectedResultGainsGraphItems,
            thisMonthGraphCalc: expectedResultGainsGraphItems,
            thisYearGraphCalc: expectedResultGainsGraphItems,
            allTimeGraphCalc: expectedResultGainsGraphItems
        };
        test('it outputs the correct gainsPercents', function () {
            expect(result).toEqual(expectedResult);
        });
    });
});
//# sourceMappingURL=gains-graph-calc.test.js.map