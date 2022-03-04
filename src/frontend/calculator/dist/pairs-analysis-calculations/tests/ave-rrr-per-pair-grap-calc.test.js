"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../utils");
var ave_rrr_per_pair_graph_calc_1 = __importDefault(require("../ave-rrr-per-pair-graph-calc"));
describe('Verify that aveRrrPerPairGraphCalc is working', function () {
    describe('When there are no trades', function () {
        var accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: []
        };
        var result = (0, ave_rrr_per_pair_graph_calc_1.default)(accountData);
        var expectedResult = [];
        test('it outputs an empty array', function () {
            expect(result).toEqual(expectedResult);
        });
    });
    describe('When there is 1 profitable trade', function () {
        var pair = 'GBPUSD';
        var accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: [
                {
                    pair: pair,
                    action: 'buy',
                    commission: 20,
                    takeProfit: 20,
                    stopLoss: 32,
                    swap: 20,
                    profitLoss: 200,
                    openTime: '2022-09-04T13:02:00Z',
                    closeTime: '2022-09-04T13:02:00Z',
                    openPrice: 0,
                    closePrice: 0
                }
            ]
        };
        var result = (0, ave_rrr_per_pair_graph_calc_1.default)(accountData);
        var expectedResult = [
            { pair: pair, rrr: 0 }
        ];
        test('it outputs the correct result', function () {
            expect(result).toEqual(expectedResult);
        });
    });
    describe('When there is 1 losing trade', function () {
        var pair = 'GBPUSD';
        var accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: [
                {
                    pair: pair,
                    action: 'buy',
                    commission: 20,
                    takeProfit: 20,
                    stopLoss: 32,
                    swap: 20,
                    profitLoss: -200,
                    openTime: '2022-09-04T13:02:00Z',
                    closeTime: '2022-09-04T13:02:00Z',
                    openPrice: 0,
                    closePrice: 0
                }
            ]
        };
        var result = (0, ave_rrr_per_pair_graph_calc_1.default)(accountData);
        var expectedResult = [
            { pair: pair, rrr: 0 }
        ];
        test('it outputs the correct result', function () {
            expect(result).toEqual(expectedResult);
        });
    });
    describe('When there are a few profitable and losing trades on 1 pair', function () {
        var pair = 'GBPUSD';
        var profits = [200, 100, 100];
        var losses = [-10, -57];
        var accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: [
                {
                    pair: pair,
                    action: 'buy',
                    commission: 20,
                    takeProfit: 20,
                    stopLoss: 32,
                    swap: 20,
                    profitLoss: profits[0],
                    openTime: '2022-09-04T13:02:00Z',
                    closeTime: '2022-09-04T13:02:00Z',
                    openPrice: 0,
                    closePrice: 0
                },
                {
                    pair: pair,
                    action: 'buy',
                    commission: 20,
                    takeProfit: 20,
                    stopLoss: 32,
                    swap: 20,
                    profitLoss: losses[0],
                    openTime: '2022-09-04T13:02:00Z',
                    closeTime: '2022-09-04T13:02:00Z',
                    openPrice: 0,
                    closePrice: 0
                },
                {
                    pair: pair,
                    action: 'buy',
                    commission: 20,
                    takeProfit: 20,
                    stopLoss: 32,
                    swap: 20,
                    profitLoss: profits[1],
                    openTime: '2022-09-04T13:02:00Z',
                    closeTime: '2022-09-04T13:02:00Z',
                    openPrice: 0,
                    closePrice: 0
                },
                {
                    pair: pair,
                    action: 'buy',
                    commission: 20,
                    takeProfit: 20,
                    stopLoss: 32,
                    swap: 20,
                    profitLoss: profits[2],
                    openTime: '2022-09-04T13:02:00Z',
                    closeTime: '2022-09-04T13:02:00Z',
                    openPrice: 0,
                    closePrice: 0
                },
                {
                    pair: pair,
                    action: 'buy',
                    commission: 20,
                    takeProfit: 20,
                    stopLoss: 32,
                    swap: 20,
                    profitLoss: losses[1],
                    openTime: '2022-09-04T13:02:00Z',
                    closeTime: '2022-09-04T13:02:00Z',
                    openPrice: 0,
                    closePrice: 0
                },
            ]
        };
        var aveProfit = ((0, utils_1.sum)(profits) / profits.length);
        var aveLoss = -1 * ((0, utils_1.sum)(losses) / losses.length);
        var result = (0, ave_rrr_per_pair_graph_calc_1.default)(accountData);
        var expectedResult = [
            { pair: pair, rrr: aveProfit / aveLoss }
        ];
        test('it outputs the correct result', function () {
            expect(result).toEqual(expectedResult);
        });
    });
    describe('When there are a few profitable and losing trades on more than 1 pair', function () {
        var pairs = ['GBPUSD', 'USDNOK'];
        var profits = [200, 100, 100];
        var losses = [-10, -57];
        var baseTrades = [
            {
                action: 'buy',
                commission: 20,
                takeProfit: 20,
                stopLoss: 32,
                swap: 20,
                profitLoss: profits[0],
                openTime: '2022-09-04T13:02:00Z',
                closeTime: '2022-09-04T13:02:00Z',
                openPrice: 0,
                closePrice: 0
            },
            {
                action: 'buy',
                commission: 20,
                takeProfit: 20,
                stopLoss: 32,
                swap: 20,
                profitLoss: losses[0],
                openTime: '2022-09-04T13:02:00Z',
                closeTime: '2022-09-04T13:02:00Z',
                openPrice: 0,
                closePrice: 0
            },
            {
                action: 'buy',
                commission: 20,
                takeProfit: 20,
                stopLoss: 32,
                swap: 20,
                profitLoss: profits[1],
                openTime: '2022-09-04T13:02:00Z',
                closeTime: '2022-09-04T13:02:00Z',
                openPrice: 0,
                closePrice: 0
            },
            {
                action: 'buy',
                commission: 20,
                takeProfit: 20,
                stopLoss: 32,
                swap: 20,
                profitLoss: profits[2],
                openTime: '2022-09-04T13:02:00Z',
                closeTime: '2022-09-04T13:02:00Z',
                openPrice: 0,
                closePrice: 0
            },
            {
                action: 'buy',
                commission: 20,
                takeProfit: 20,
                stopLoss: 32,
                swap: 20,
                profitLoss: losses[1],
                openTime: '2022-09-04T13:02:00Z',
                closeTime: '2022-09-04T13:02:00Z',
                openPrice: 0,
                closePrice: 0
            },
        ];
        var accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: (function () {
                var trades = [];
                var _loop_1 = function (pair) {
                    baseTrades.forEach(function (trade) {
                        trades.push(__assign(__assign({}, trade), { pair: pair }));
                    });
                };
                for (var _i = 0, pairs_1 = pairs; _i < pairs_1.length; _i++) {
                    var pair = pairs_1[_i];
                    _loop_1(pair);
                }
                return trades;
            })()
        };
        var aveProfit = ((0, utils_1.sum)(profits) / profits.length);
        var aveLoss = -1 * ((0, utils_1.sum)(losses) / losses.length);
        var result = (0, ave_rrr_per_pair_graph_calc_1.default)(accountData);
        var expectedResult = pairs.map(function (pair) { return ({
            pair: pair,
            rrr: aveProfit / aveLoss
        }); });
        test('it outputs the correct result', function () {
            expect(result).toEqual(expectedResult);
        });
    });
});
//# sourceMappingURL=ave-rrr-per-pair-grap-calc.test.js.map