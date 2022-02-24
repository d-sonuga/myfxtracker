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
var utils_2 = require("../../utils");
var open_hour_table_calc_1 = __importDefault(require("../open-hour-table-calc"));
var utils_3 = require("./utils");
var generateTrades = function (min, max) {
    if (min === void 0) { min = 2; }
    if (max === void 0) { max = 10000; }
    var trades = [];
    var noOfTrades = (0, utils_2.randomInt)(min, max);
    var newTrade = function () {
        var time = "".concat((0, utils_3.randomDate)(), "T").concat((0, utils_3.randomTime)());
        return {
            pair: 'USDNOK',
            action: 'buy',
            riskRewardRatio: 0,
            profitLoss: (0, utils_2.randomNumber)(-100000, 100000),
            takeProfit: 0,
            stopLoss: 0,
            openTime: time,
            closeTime: time
        };
    };
    for (var i = 0; i < noOfTrades; i++) {
        trades.push(newTrade());
    }
    return trades;
};
describe('Verify openHourTableCalc is working', function () {
    describe('When there are no trades', function () {
        var accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: []
        };
        var result = (0, open_hour_table_calc_1.default)(accountData);
        var expectedResult = [];
        test('it should output an empty array', function () {
            expect(result).toEqual(expectedResult);
        });
    });
    describe('When there is 1 trade', function () {
        var accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: [
                {
                    pair: 'GBPUSD',
                    openTime: '2022-02-08T13:04:00Z',
                    closeTime: '2022-02-08T13:04:00Z',
                    profitLoss: 300,
                    takeProfit: 0,
                    stopLoss: 0,
                    riskRewardRatio: 0,
                    action: 'buy'
                }
            ]
        };
        var result = (0, open_hour_table_calc_1.default)(accountData);
        var expectedResult = [
            { hour: '13:00 - 13:59', result: 300, noOfTrades: 1 }
        ];
        test('it should output the correct result', function () {
            expect(result).toEqual(expectedResult);
        });
    });
    describe('When there is more than 1 trade', function () {
        var baseTrade = {
            pair: 'GBPUSD',
            profitLoss: 300,
            takeProfit: 0,
            stopLoss: 0,
            riskRewardRatio: 0,
            action: 'buy'
        };
        var profitLoss12 = [300, -12, 233, 433];
        var profitLoss13 = [23, 455, 132];
        var profitLoss8 = [32, 45];
        var profitLoss15 = [34, 543, -10000];
        var trades = [
            __assign(__assign({}, baseTrade), { openTime: '2021-03-10T12:04:00Z', closeTime: '2021-03-11T12:04:00Z', profitLoss: profitLoss12[0] }),
            __assign(__assign({}, baseTrade), { openTime: '2022-02-23T12:20:00Z', closeTime: '2022-02-24T13:12:00Z', profitLoss: profitLoss12[1] }),
            __assign(__assign({}, baseTrade), { openTime: '2022-02-08T12:34:00Z', closeTime: '2022-02-08T12:34:00Z', profitLoss: profitLoss12[2] }),
            __assign(__assign({}, baseTrade), { openTime: '2022-02-08T12:04:00Z', closeTime: '2022-02-08T12:04:00Z', profitLoss: profitLoss12[3] }),
            __assign(__assign({}, baseTrade), { openTime: '2022-02-08T13:04:00Z', closeTime: '2022-02-08T13:04:00Z', profitLoss: profitLoss13[0] }),
            __assign(__assign({}, baseTrade), { openTime: '2022-02-08T13:04:00Z', closeTime: '2022-02-08T13:04:00Z', profitLoss: profitLoss13[1] }),
            __assign(__assign({}, baseTrade), { openTime: '2022-02-08T13:04:00Z', closeTime: '2022-02-08T13:04:00Z', profitLoss: profitLoss13[2] }),
            __assign(__assign({}, baseTrade), { openTime: '2022-02-08T08:04:00Z', closeTime: '2022-02-08T13:04:00Z', profitLoss: profitLoss8[0] }),
            __assign(__assign({}, baseTrade), { openTime: '2022-02-08T08:04:00Z', closeTime: '2022-02-08T08:04:00Z', profitLoss: profitLoss8[1] }),
            __assign(__assign({}, baseTrade), { openTime: '2022-02-08T15:04:00Z', closeTime: '2022-02-08T15:04:00Z', profitLoss: profitLoss15[0] }),
            __assign(__assign({}, baseTrade), { openTime: '2022-02-08T15:04:00Z', closeTime: '2022-02-08T15:04:00Z', profitLoss: profitLoss15[1] }),
            __assign(__assign({}, baseTrade), { openTime: '2022-02-08T15:04:00Z', closeTime: '2022-02-08T15:04:00Z', profitLoss: profitLoss15[2] }),
        ];
        var accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: trades
        };
        var result = (0, open_hour_table_calc_1.default)(accountData);
        var expectedResult = [
            { hour: '12:00 - 12:59', noOfTrades: profitLoss12.length, result: (0, utils_1.sum)(profitLoss12) },
            { hour: '13:00 - 13:59', noOfTrades: profitLoss13.length, result: (0, utils_1.sum)(profitLoss13) },
            { hour: '08:00 - 08:59', noOfTrades: profitLoss8.length, result: (0, utils_1.sum)(profitLoss8) },
            { hour: '15:00 - 15:59', noOfTrades: profitLoss15.length, result: (0, utils_1.sum)(profitLoss15) },
        ];
        test('it should output the correct result', function () {
            expect(result).toEqual(expectedResult);
        });
    });
    describe('When there is more than 1 trade, all random', function () {
        var trades = generateTrades();
        var accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: trades
        };
        var result = (0, open_hour_table_calc_1.default)(accountData);
        var expectedResult = (function () {
            var hourMap = {};
            var format = function (openTime) {
                var hour = openTime.split('T')[1].split(':')[0];
                return "".concat(hour, ":00 - ").concat(hour, ":59");
            };
            for (var _i = 0, trades_1 = trades; _i < trades_1.length; _i++) {
                var trade = trades_1[_i];
                var hour = format(trade.openTime);
                if (!(hour in hourMap)) {
                    hourMap[hour] = { result: 0, noOfTrades: 0 };
                }
                hourMap[hour].result += trade.profitLoss;
                hourMap[hour].noOfTrades += 1;
            }
            return Object.keys(hourMap).map(function (hour) { return ({
                hour: hour,
                result: hourMap[hour].result, noOfTrades: hourMap[hour].noOfTrades
            }); });
        })();
        test('it should output the correct result', function () {
            expect(result).toEqual(expectedResult);
        });
    });
});
//# sourceMappingURL=open-hour-table-calc.test.js.map