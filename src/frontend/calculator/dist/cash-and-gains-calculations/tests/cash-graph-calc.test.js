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
var cash_graph_calc_1 = __importDefault(require("../cash-graph-calc"));
/**
 * @Note These tests are far from complete
 */
describe('Verify cashGraphCalc works', function () {
    /** To create a new trade object without having to specify all trade attributes */
    var newTrade = function (attr) {
        return {
            profitLoss: (0, utils_1.randomNumber)(-1000000, 1000000),
            openTime: attr.time !== undefined ? attr.time : '2021-10-18T12:09:00Z',
            closeTime: attr.time !== undefined ? attr.time : '2021-10-18T12:09:00Z',
            pair: 'GBPUSD',
            action: 'buy',
            riskRewardRatio: 2,
            takeProfit: 0,
            stopLoss: 0,
            openPrice: 0,
            closePrice: 0
        };
    };
    var defaultCashGraphItem = [{ tradeNo: 0, balance: 0 }];
    describe('When there are no trades, deposits or withdrawals in accountData', function () {
        var accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: []
        };
        var result = (0, cash_graph_calc_1.default)(accountData);
        var defaultCashGraphItem = [{ tradeNo: 0, balance: 0 }];
        var expectedResult = {
            todayGraphCalc: defaultCashGraphItem,
            thisWeekGraphCalc: defaultCashGraphItem,
            thisMonthGraphCalc: defaultCashGraphItem,
            thisYearGraphCalc: defaultCashGraphItem,
            allTimeGraphCalc: defaultCashGraphItem
        };
        test('it outputs the default output', function () {
            expect(result).toEqual(expectedResult);
        });
    });
    describe('When there are only withdrawals, but no trades', function () {
        var withdrawals = [1, 2, 3, 4, 5].map(function (i) { return ({ account: 3, amount: 500, time: '2022-12-02T18:34:00Z' }); });
        var accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: withdrawals,
            trades: []
        };
        var result = (0, cash_graph_calc_1.default)(accountData);
        var defaultCashGraphItem = [{ tradeNo: 0, balance: 0 }];
        var expectedResult = {
            todayGraphCalc: defaultCashGraphItem,
            thisWeekGraphCalc: defaultCashGraphItem,
            thisMonthGraphCalc: defaultCashGraphItem,
            thisYearGraphCalc: defaultCashGraphItem,
            allTimeGraphCalc: defaultCashGraphItem
        };
        test('it outputs the default output', function () {
            expect(result).toEqual(expectedResult);
        });
    });
    describe('When there are only deposits, but no trades', function () {
        var deposits = [1, 2, 3, 4, 5].map(function (i) { return ({ account: 3, amount: 500, time: '2022-12-02T12:09:00Z' }); });
        var accountData = {
            name: 'dummy account',
            deposits: deposits,
            withdrawals: [],
            trades: []
        };
        var result = (0, cash_graph_calc_1.default)(accountData);
        var defaultCashGraphItem = [{ tradeNo: 0, balance: deposits[0].amount }];
        var expectedResult = {
            todayGraphCalc: defaultCashGraphItem,
            thisWeekGraphCalc: defaultCashGraphItem,
            thisMonthGraphCalc: defaultCashGraphItem,
            thisYearGraphCalc: defaultCashGraphItem,
            allTimeGraphCalc: defaultCashGraphItem
        };
        test('it outputs the default output', function () {
            expect(result).toEqual(expectedResult);
        });
    });
    describe('When there are only trades', function () {
        var cummulativeAdditions = function (trades) {
            var cummulativeAddition = 0;
            var result = [];
            for (var i in trades) {
                var trade = trades[i];
                cummulativeAddition += trade.profitLoss;
                result.push({ tradeNo: parseInt(i) + 1, balance: cummulativeAddition });
            }
            return result;
        };
        /** 30th October, 2021 */
        var today = new Date(2021, 9, 30);
        /**
         * 12th, 14th, 18th, 25th, 29th October 2021
         * 12th and 14th are in the same week
         * 18th is the only one in its week
         * 25th and 29th are in the same week, with 30th which is today
         * */
        var todayTrades = [];
        var thisWeekTrades = [
            {
                profitLoss: (0, utils_1.randomNumber)(-1000000, 1000000), openTime: '2021-10-25T18:34:00Z',
                closeTime: '2021-10-25T12:09:00Z', pair: 'GBPUSD', action: 'buy', riskRewardRatio: 2,
                stopLoss: 0, takeProfit: 0, openPrice: 0, closePrice: 0
            },
            {
                profitLoss: (0, utils_1.randomNumber)(-1000000, 1000000), openTime: '2021-10-29T18:34:00Z',
                closeTime: '2021-10-29T12:09:00Z', pair: 'GBPUSD', action: 'buy', riskRewardRatio: 2,
                stopLoss: 0, takeProfit: 0, openPrice: 0, closePrice: 0
            }
        ];
        var thisMonthTrades = __spreadArray(__spreadArray([], thisWeekTrades, true), [
            {
                profitLoss: (0, utils_1.randomNumber)(-1000000, 1000000), openTime: '2021-10-18T12:09:00Z',
                closeTime: '2021-10-18T12:09:00Z', pair: 'GBPUSD', action: 'buy', riskRewardRatio: 2,
                stopLoss: 0, takeProfit: 0, openPrice: 0, closePrice: 0
            }
        ], false);
        var thisYearTrades = __spreadArray(__spreadArray([], thisMonthTrades, true), [
            {
                profitLoss: (0, utils_1.randomNumber)(-1000000, 1000000), openTime: '2021-09-14T12:09:00Z',
                closeTime: '2021-09-14T12:09:00Z', pair: 'GBPUSD', action: 'buy', riskRewardRatio: 2,
                stopLoss: 0, takeProfit: 0, openPrice: 0, closePrice: 0
            }
        ], false);
        var allTimeTrades = __spreadArray(__spreadArray([], thisYearTrades, true), [
            {
                profitLoss: (0, utils_1.randomNumber)(-1000000, 1000000), openTime: '2020-09-12T12:09:00Z',
                closeTime: '2020-09-12T12:09:00Z', pair: 'GBPUSD', action: 'buy', riskRewardRatio: 2,
                stopLoss: 0, takeProfit: 0, openPrice: 0, closePrice: 0
            }
        ], false);
        var accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: allTimeTrades
        };
        var result = (0, cash_graph_calc_1.default)(accountData, today);
        var expectedResult = {
            todayGraphCalc: __spreadArray([], defaultCashGraphItem, true),
            thisWeekGraphCalc: __spreadArray(__spreadArray([], defaultCashGraphItem, true), cummulativeAdditions(thisWeekTrades), true),
            thisMonthGraphCalc: __spreadArray(__spreadArray([], defaultCashGraphItem, true), cummulativeAdditions(thisMonthTrades), true),
            thisYearGraphCalc: __spreadArray(__spreadArray([], defaultCashGraphItem, true), cummulativeAdditions(thisYearTrades), true),
            allTimeGraphCalc: __spreadArray(__spreadArray([], defaultCashGraphItem, true), cummulativeAdditions(allTimeTrades), true)
        };
        test('it outputs the correct result', function () {
            expect(result).toEqual(expectedResult);
        });
    });
    describe('When there are deposits and trades', function () {
        var today = new Date(2021, 1, 18);
        /**
         * To make the required additions easier, the deposits and trades are arranged
         * in such a way that all deposits that took place before a set of trades will
         * be in an array that has the same tag as the trades array.
         * For example,
         * depositsA are all deposits that took place before all the trades in tradesA
         */
        var depositsA = [
            { account: 2, amount: 200, time: '2021-02-15T18:34:00Z' }
        ];
        var tradesA = [
            newTrade({ time: '2021-02-17T18:34:00Z' })
        ];
        var accountData = {
            name: 'dummy account',
            deposits: __spreadArray([], depositsA, true),
            withdrawals: [],
            trades: __spreadArray([], tradesA, true)
        };
        var defaultCashGraphItem = [{ tradeNo: 0, balance: depositsA[0].amount }];
        var result = (0, cash_graph_calc_1.default)(accountData, today);
        var expectedResult = {
            todayGraphCalc: __spreadArray([], defaultCashGraphItem, true),
            thisWeekGraphCalc: __spreadArray(__spreadArray([], defaultCashGraphItem, true), [
                { tradeNo: 1, balance: (0, utils_1.sumObjArray)(tradesA, 'profitLoss') + (0, utils_1.sumObjArray)(depositsA, 'amount') }
            ], false),
            thisMonthGraphCalc: __spreadArray(__spreadArray([], defaultCashGraphItem, true), [
                { tradeNo: 1, balance: (0, utils_1.sumObjArray)(tradesA, 'profitLoss') + (0, utils_1.sumObjArray)(depositsA, 'amount') }
            ], false),
            thisYearGraphCalc: __spreadArray(__spreadArray([], defaultCashGraphItem, true), [
                { tradeNo: 1, balance: (0, utils_1.sumObjArray)(tradesA, 'profitLoss') + (0, utils_1.sumObjArray)(depositsA, 'amount') }
            ], false),
            allTimeGraphCalc: __spreadArray(__spreadArray([], defaultCashGraphItem, true), [
                { tradeNo: 1, balance: (0, utils_1.sumObjArray)(tradesA, 'profitLoss') + (0, utils_1.sumObjArray)(depositsA, 'amount') }
            ], false)
        };
        test('it outputs the expected result', function () {
            expect(result).toEqual(expectedResult);
        });
    });
});
//# sourceMappingURL=cash-graph-calc.test.js.map