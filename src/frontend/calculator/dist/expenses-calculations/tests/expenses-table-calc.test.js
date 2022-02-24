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
var expenses_table_calc_1 = __importDefault(require("../expenses-table-calc"));
/** @Note These tests are far from complete */
var newTrade = function (pair, commission, swap) {
    return {
        pair: pair,
        commission: commission,
        swap: swap,
        profitLoss: (0, utils_1.randomNumber)(-10000, 10000),
        takeProfit: 0,
        stopLoss: 0,
        action: 'buy',
        riskRewardRatio: 0,
        openTime: '2022-10-23T13:23:00Z',
        closeTime: '2022-10-23T13:23:00Z'
    };
};
describe('Verify that expensesTableCalc is working', function () {
    describe('When accountData.trades is empty', function () {
        var accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: []
        };
        var result = (0, expenses_table_calc_1.default)(accountData);
        var expectedResult = [];
        test('it outputs an empty array', function () {
            expect(result).toEqual(expectedResult);
        });
    });
    describe('When accountData.trades has 1 trade', function () {
        var pair = 'GBPUSD';
        var commission = 20;
        var swap = 23;
        var accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: [
                newTrade(pair, commission, swap)
            ]
        };
        var result = (0, expenses_table_calc_1.default)(accountData);
        var expectedResult = [
            { pair: pair, commission: commission, swap: swap }
        ];
        test('it ouputs the correct result', function () {
            expect(result).toEqual(expectedResult);
        });
    });
    describe('When accountData.trades has a few trades', function () {
        var somePairs = ['GBPUSD', 'USDNOK', 'USDSEK', 'EURUSD', 'GBPNZD', 'JPYUSD'];
        var noOfTradesPerPair = 50;
        var pairTradeMap = {};
        var _loop_1 = function (pair) {
            pairTradeMap[pair] = (function () {
                var trades = [];
                for (var i = 0; i < noOfTradesPerPair; i++) {
                    trades.push(newTrade(pair, (0, utils_1.randomNumber)(0, 10000), (0, utils_1.randomNumber)(0, 1000)));
                }
                return trades;
            })();
        };
        for (var _i = 0, somePairs_1 = somePairs; _i < somePairs_1.length; _i++) {
            var pair = somePairs_1[_i];
            _loop_1(pair);
        }
        var trades = (function () {
            var allTrades = [];
            somePairs.forEach(function (pair) {
                allTrades = __spreadArray(__spreadArray([], allTrades, true), pairTradeMap[pair], true);
            });
            return allTrades;
        })();
        var accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: trades
        };
        var result = (0, expenses_table_calc_1.default)(accountData);
        var expectedResult = Object.keys(pairTradeMap).map(function (pair) {
            var commission = 0;
            var swap = 0;
            pairTradeMap[pair].forEach(function (trade) {
                commission += trade.commission || 0;
                swap += trade.swap || 0;
            });
            return {
                pair: pair,
                commission: commission,
                swap: swap
            };
        });
        test('it outputs the correct result', function () {
            expect(result).toEqual(expectedResult);
        });
    });
});
//# sourceMappingURL=expenses-table-calc.test.js.map