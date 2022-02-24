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
var long_balance_graph_calc_1 = __importDefault(require("../long-balance-graph-calc"));
/**
 * @TODO add proper tests (these things in this file are not tests)
 */
describe('Verify that longBalanceGraphCalc is working', function () {
    /**
     * date of trade, Deposits and withdrawals aren't needed for these tests
     * because they aren't used in any of the calculations
     */
    var deposits = [];
    var withdrawals = [];
    var tradeDateStr = '2022-10-20T12:09:00Z';
    describe('When there are no trades in accountData', function () {
        var accountData = {
            name: 'dummy account',
            deposits: deposits,
            withdrawals: withdrawals,
            trades: []
        };
        var result = (0, long_balance_graph_calc_1.default)(accountData);
        var expectedResult = [
            { tradeNo: 0, result: 0 }
        ];
        test('results are the default results', function () {
            expect(result).toEqual(expectedResult);
        });
    });
    describe('When there is only 1 long (action = buy) trade in accountData', function () {
        var tradeProfitLoss = 300;
        var trades = [
            {
                pair: 'GBPJPY',
                action: 'buy',
                openTime: tradeDateStr,
                closeTime: tradeDateStr,
                riskRewardRatio: 3,
                profitLoss: tradeProfitLoss,
                pips: 3,
                notes: '',
                entryImageLink: '',
                exitImageLink: '',
                lots: 3,
                commission: 2.3,
                swap: 3,
                takeProfit: 0,
                stopLoss: 0
            }
        ];
        var accountData = {
            name: 'dummy account',
            deposits: deposits,
            withdrawals: withdrawals,
            trades: trades
        };
        var result = (0, long_balance_graph_calc_1.default)(accountData);
        var expectedResult = [
            { tradeNo: 0, result: 0 },
            { tradeNo: 1, result: tradeProfitLoss }
        ];
        test('it outputs results with the correct data', function () {
            expect(result).toEqual(expectedResult);
        });
    });
    describe('When there is only 1 short (action = sell) trade in accountData', function () {
        var tradeProfitLoss = 300;
        var trades = [
            {
                pair: 'GBPJPY',
                action: 'sell',
                openTime: tradeDateStr,
                closeTime: tradeDateStr,
                riskRewardRatio: 3,
                profitLoss: tradeProfitLoss,
                pips: 3,
                notes: '',
                entryImageLink: '',
                exitImageLink: '',
                lots: 3,
                commission: 2.3,
                swap: 3,
                takeProfit: 0,
                stopLoss: 0
            }
        ];
        var accountData = {
            name: 'dummy account',
            deposits: deposits,
            withdrawals: withdrawals,
            trades: trades
        };
        var result = (0, long_balance_graph_calc_1.default)(accountData);
        var expectedResult = [
            { tradeNo: 0, result: 0 }
        ];
        test('it outputs results with the correct data', function () {
            expect(result).toEqual(expectedResult);
        });
    });
    describe('When there are many longs', function () {
        var createTrade = function (date) { return ({
            pair: 'GBPJPY',
            action: 'buy',
            openTime: date,
            closeTime: date,
            riskRewardRatio: 3,
            profitLoss: (0, utils_1.randomNumber)(-100000000, 100000000),
            pips: 3,
            notes: '',
            entryImageLink: '',
            exitImageLink: '',
            lots: 3,
            commission: 2.3,
            swap: 3,
            takeProfit: 0,
            stopLoss: 0
        }); };
        var createTradeSet = function (date, noOfTrades) {
            var trades = [];
            for (var i = 0; i < noOfTrades; i++) {
                trades.push(createTrade(date));
            }
            return trades;
        };
        // 14th October, 2021
        var todayDateStr = '2021-10-14T12:09:00Z';
        var thisWeekDateStr = '2021-10-12T12:09:00Z';
        var thisMonthDateStr = '2021-10-04T12:09:00Z';
        var thisYearDateStr = '2021-08-04T12:09:00Z';
        var lastYearDateStr = '2020-08-04T12:09:00Z';
        var todayTrades = createTradeSet(todayDateStr, 20);
        var thisWeekTrades = createTradeSet(thisWeekDateStr, 34);
        var thisMonthTrades = createTradeSet(thisMonthDateStr, 23);
        var thisYearTrades = createTradeSet(thisYearDateStr, 33);
        var lastYearTrades = createTradeSet(lastYearDateStr, 23);
        var accountData = {
            name: 'dummy account',
            trades: __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], lastYearTrades, true), thisYearTrades, true), thisMonthTrades, true), thisWeekTrades, true), todayTrades, true),
            deposits: [],
            withdrawals: []
        };
        var result = (0, long_balance_graph_calc_1.default)(accountData);
        var expectedResult = (function () {
            var tradeSet = [lastYearTrades, thisYearTrades, thisMonthTrades, thisWeekTrades, todayTrades];
            var tradeNo = 0;
            var cummulativeResult = 0;
            var result = [{ tradeNo: 0, result: 0 }];
            for (var _i = 0, tradeSet_1 = tradeSet; _i < tradeSet_1.length; _i++) {
                var trades = tradeSet_1[_i];
                for (var _a = 0, trades_1 = trades; _a < trades_1.length; _a++) {
                    var trade = trades_1[_a];
                    tradeNo += 1;
                    cummulativeResult += trade.profitLoss;
                    result.push({
                        tradeNo: tradeNo,
                        result: cummulativeResult
                    });
                }
            }
            return result;
        })();
        test('it outputs the expected result', function () {
            expect(result).toEqual(expectedResult);
        });
    });
});
//# sourceMappingURL=long-balance-graph-calc.test.js.map