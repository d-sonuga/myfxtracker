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
var time_analysis_graph_calc_1 = __importDefault(require("../time-analysis-graph-calc"));
var utils_1 = require("../../utils");
var weekly_summary_calc_1 = require("../../overview-calculations/weekly-summary-calc");
var utils_2 = require("./utils");
var baseTrade = function () {
    return {
        action: 'buy',
        takeProfit: 0,
        stopLoss: 0,
        riskRewardRatio: 0,
        pair: 'GBPUSD',
        profitLoss: (0, utils_1.randomNumber)(-10000, 10000),
        openPrice: 0,
        closePrice: 0
    };
};
var putInSameOrder = function (result, expectedResult) {
    return {
        todayGraphCalc: (0, utils_2.putInSameOrder)(result.todayGraphCalc, expectedResult.todayGraphCalc, 'openHour'),
        thisWeekGraphCalc: (0, utils_2.putInSameOrder)(result.thisWeekGraphCalc, expectedResult.thisWeekGraphCalc, 'openHour'),
        thisMonthGraphCalc: (0, utils_2.putInSameOrder)(result.thisMonthGraphCalc, expectedResult.thisMonthGraphCalc, 'openHour'),
        thisYearGraphCalc: (0, utils_2.putInSameOrder)(result.thisYearGraphCalc, expectedResult.thisYearGraphCalc, 'openHour'),
        allTimeGraphCalc: (0, utils_2.putInSameOrder)(result.allTimeGraphCalc, expectedResult.allTimeGraphCalc, 'openHour')
    };
};
var generateTrades = function (today, min, max) {
    if (min === void 0) { min = 2; }
    if (max === void 0) { max = 10000; }
    var noOfTrades = (0, utils_1.randomInt)(min, max);
    var noOfTradesToday = Math.round(noOfTrades / 5);
    var noOfTradesThisWeek = Math.round(noOfTrades / 5);
    var noOfTradesThisMonth = Math.round(noOfTrades / 5);
    var noOfTradesThisYear = Math.round(noOfTrades / 5);
    var noOfTradesAllTime = noOfTrades - (noOfTradesToday +
        noOfTradesThisWeek + noOfTradesThisMonth + noOfTradesThisYear);
    var todayTrades = [];
    var thisWeekTrades = [];
    var thisMonthTrades = [];
    var thisYearTrades = [];
    var allTimeTrades = [];
    var toTimeStr = function (day) {
        var month = day.getMonth() + 1 < 10 ? "0".concat(day.getMonth() + 1) : "".concat(day.getMonth() + 1);
        var dayStr = day.getDate() < 10 ? "0".concat(day.getDate()) : "".concat(day.getDate());
        return "".concat(day.getFullYear(), "-").concat(month, "-").concat(dayStr, "T").concat((0, utils_2.randomTime)());
    };
    for (var i = 0; i < noOfTradesToday; i++) {
        var time = function () { return toTimeStr(today); };
        todayTrades.push(__assign({ openTime: time(), closeTime: time() }, baseTrade()));
    }
    thisWeekTrades = __spreadArray([], todayTrades, true);
    var _loop_1 = function (i) {
        var getRandomDayInWeek = function () {
            var daysInWeek = (0, weekly_summary_calc_1.getWeekDates)(today);
            return daysInWeek[(0, utils_1.randomInt)(0, daysInWeek.length - 1)];
        };
        var tradeTime = function () {
            var day = getRandomDayInWeek();
            if (day.getDate() >= today.getDate()) {
                return tradeTime();
            }
            return toTimeStr(day);
        };
        thisWeekTrades.push(__assign({ openTime: tradeTime(), closeTime: tradeTime() }, baseTrade()));
    };
    for (var i = 0; i < noOfTradesThisWeek; i++) {
        _loop_1(i);
    }
    thisMonthTrades = __spreadArray([], thisWeekTrades, true);
    var _loop_2 = function (i) {
        var getRandomDayInMonth = function () {
            var date = (0, utils_1.randomInt)(1, today.getDate());
            var day = new Date(today.getFullYear(), today.getMonth(), date);
            // Day shouldn't be Sunday or Saturday
            if (day.getDay() == 0 || day.getDay() == 6) {
                return getRandomDayInMonth();
            }
            // Day should not be in the same week
            if (today.getDate() == day.getDate() || (0, utils_1.sameWeek)(day, today)) {
                return getRandomDayInMonth();
            }
            return day;
        };
        var tradeTime = (function () {
            var day = getRandomDayInMonth();
            return toTimeStr(day);
        })();
        thisMonthTrades.push(__assign({ openTime: tradeTime, closeTime: tradeTime }, baseTrade()));
    };
    for (var i = 0; i < noOfTradesThisMonth; i++) {
        _loop_2(i);
    }
    thisYearTrades = __spreadArray([], thisMonthTrades, true);
    var _loop_3 = function (i) {
        var getRandomDayInYear = function () {
            var date = (0, utils_1.randomInt)(1, 29);
            var month = (0, utils_1.randomInt)(0, today.getMonth());
            var day = new Date(today.getFullYear(), month, date);
            // Day shouldn't be Sunday or Saturday
            if (day.getDay() == 0 || day.getDay() == 6) {
                return getRandomDayInYear();
            }
            // Day shouldnt be in the same month with today
            if (day.getMonth() == today.getMonth()) {
                return getRandomDayInYear();
            }
            return day;
        };
        var tradeTime = (function () {
            var day = getRandomDayInYear();
            return toTimeStr(day);
        })();
        thisYearTrades.push(__assign({ openTime: tradeTime, closeTime: tradeTime }, baseTrade()));
    };
    for (var i = 0; i < noOfTradesThisYear; i++) {
        _loop_3(i);
    }
    allTimeTrades = __spreadArray([], thisYearTrades, true);
    var _loop_4 = function (i) {
        var getRandomDay = function () {
            var date = (0, utils_1.randomInt)(1, today.getDate());
            var month = (0, utils_1.randomInt)(0, today.getMonth());
            var year = (0, utils_1.randomInt)(1970, today.getFullYear());
            var day = new Date(year, month, date);
            // Day shouldn't be Sunday or Saturday
            if (day.getDay() == 0 || day.getDay() == 6) {
                return getRandomDay();
            }
            if (today.getFullYear() == day.getFullYear()) {
                return getRandomDay();
            }
            return day;
        };
        var tradeTime = (function () {
            var day = getRandomDay();
            return toTimeStr(day);
        })();
        allTimeTrades.push(__assign({ openTime: tradeTime, closeTime: tradeTime }, baseTrade()));
    };
    for (var i = 0; i < noOfTradesAllTime; i++) {
        _loop_4(i);
    }
    return [todayTrades, thisWeekTrades, thisMonthTrades, thisYearTrades, allTimeTrades];
};
var graphCalc = function (trades) {
    var tradeHourToResultMap = {};
    for (var _i = 0, trades_1 = trades; _i < trades_1.length; _i++) {
        var trade = trades_1[_i];
        // extract the '18' in '2022-10-3T18:30:00Z'
        var hour = trade.openTime.split('T')[1].split(':')[0];
        if (!(hour in tradeHourToResultMap)) {
            tradeHourToResultMap[hour] = 0;
        }
        tradeHourToResultMap[hour] += trade.profitLoss;
    }
    return Object.keys(tradeHourToResultMap).map(function (hour) { return ({
        openHour: hour + ':00', result: tradeHourToResultMap[hour]
    }); });
};
describe('Verify timeAnalysisGraphCalc is working', function () {
    describe('When accountData.trades is empty', function () {
        var accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: []
        };
        var result = (0, time_analysis_graph_calc_1.default)(accountData);
        var expectedResult = {
            todayGraphCalc: [],
            thisWeekGraphCalc: [],
            thisMonthGraphCalc: [],
            thisYearGraphCalc: [],
            allTimeGraphCalc: []
        };
        test('it outputs the default result', function () {
            expect(result).toEqual(expectedResult);
        });
    });
    describe('When accountData.trades has 1 trade', function () {
        // Today is 8th February, 2022
        var today = new Date(2022, 1, 8);
        var hour18 = '18:34';
        var trades = [
            __assign({ openTime: "2022-02-01T".concat(hour18, ":00Z"), closeTime: "2022-02-01T".concat(hour18, ":00Z") }, baseTrade())
        ];
        var accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: trades
        };
        var result = (0, time_analysis_graph_calc_1.default)(accountData, today);
        var expectedResult = {
            todayGraphCalc: [],
            thisWeekGraphCalc: [],
            thisMonthGraphCalc: [{ result: trades[0].profitLoss, openHour: '18:00' }],
            thisYearGraphCalc: [{ result: trades[0].profitLoss, openHour: '18:00' }],
            allTimeGraphCalc: [{ result: trades[0].profitLoss, openHour: '18:00' }],
        };
        test('it outputs the correct result', function () {
            expect(result).toEqual(expectedResult);
        });
    });
    describe('When accountData.trades has more than 1 trade', function () {
        // 8th February, 2022
        var today = new Date(2022, 1, 8);
        var todayProfitLoss = [300, -200];
        var thisWeekProfitLoss = [200, 12];
        var thisMonthProfitLoss = [34, 3900];
        var thisYearProfitLoss = [34, 43];
        var allTimeProfitLoss = [23, 45, 67, 888, -1000];
        var accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: [
                __assign(__assign({}, baseTrade()), { openTime: '2022-02-08T12:03:00Z', closeTime: '2022-02-08T12:03:00Z', profitLoss: todayProfitLoss[0] }),
                __assign(__assign({}, baseTrade()), { openTime: '2022-02-08T14:03:00Z', closeTime: '2022-02-08T14:03:00Z', profitLoss: todayProfitLoss[1] }),
                __assign(__assign({}, baseTrade()), { openTime: '2022-02-07T14:33:00Z', closeTime: '2022-02-07T14:33:00Z', profitLoss: thisWeekProfitLoss[0] }),
                __assign(__assign({}, baseTrade()), { openTime: '2022-02-07T16:27:00Z', closeTime: '2022-02-07T16:27:00Z', profitLoss: thisWeekProfitLoss[1] }),
                __assign(__assign({}, baseTrade()), { openTime: '2022-02-01T14:33:00Z', closeTime: '2022-02-01T14:33:00Z', profitLoss: thisMonthProfitLoss[0] }),
                __assign(__assign({}, baseTrade()), { openTime: '2022-02-01T16:27:00Z', closeTime: '2022-02-01T16:27:00Z', profitLoss: thisMonthProfitLoss[1] }),
                __assign(__assign({}, baseTrade()), { openTime: '2022-01-07T08:33:00Z', closeTime: '2022-01-07T08:33:00Z', profitLoss: thisYearProfitLoss[0] }),
                __assign(__assign({}, baseTrade()), { openTime: '2022-01-07T10:27:00Z', closeTime: '2022-01-07T10:27:00Z', profitLoss: thisYearProfitLoss[1] }),
                __assign(__assign({}, baseTrade()), { openTime: '2021-02-07T17:33:00Z', closeTime: '2021-02-07T17:33:00Z', profitLoss: allTimeProfitLoss[0] }),
                __assign(__assign({}, baseTrade()), { openTime: '2020-02-07T16:27:00Z', closeTime: '2020-02-07T16:27:00Z', profitLoss: allTimeProfitLoss[1] }),
                __assign(__assign({}, baseTrade()), { openTime: '2019-02-07T13:33:00Z', closeTime: '2019-02-07T13:33:00Z', profitLoss: allTimeProfitLoss[2] }),
                __assign(__assign({}, baseTrade()), { openTime: '2010-02-07T11:27:00Z', closeTime: '2010-02-07T11:27:00Z', profitLoss: allTimeProfitLoss[3] }),
                __assign(__assign({}, baseTrade()), { openTime: '2011-02-07T11:33:00Z', closeTime: '2011-02-07T11:33:00Z', profitLoss: allTimeProfitLoss[4] })
            ]
        };
        var result = (0, time_analysis_graph_calc_1.default)(accountData, today);
        var expectedResult = {
            todayGraphCalc: [
                { openHour: '12:00', result: todayProfitLoss[0] },
                { openHour: '14:00', result: todayProfitLoss[1] }
            ],
            thisWeekGraphCalc: [
                { openHour: '12:00', result: todayProfitLoss[0] },
                { openHour: '14:00', result: todayProfitLoss[1] + thisWeekProfitLoss[0] },
                { openHour: '16:00', result: thisWeekProfitLoss[1] }
            ],
            thisMonthGraphCalc: [
                { openHour: '12:00', result: todayProfitLoss[0] },
                { openHour: '14:00', result: todayProfitLoss[1] + thisWeekProfitLoss[0] + thisMonthProfitLoss[0] },
                { openHour: '16:00', result: thisWeekProfitLoss[1] + thisMonthProfitLoss[1] }
            ],
            thisYearGraphCalc: [
                { openHour: '08:00', result: thisYearProfitLoss[0] },
                { openHour: '10:00', result: thisYearProfitLoss[1] },
                { openHour: '12:00', result: todayProfitLoss[0] },
                { openHour: '14:00', result: todayProfitLoss[1] + thisWeekProfitLoss[0] + thisMonthProfitLoss[0] },
                { openHour: '16:00', result: thisWeekProfitLoss[1] + thisMonthProfitLoss[1] },
            ],
            allTimeGraphCalc: [
                { openHour: '08:00', result: thisYearProfitLoss[0] },
                { openHour: '10:00', result: thisYearProfitLoss[1] },
                { openHour: '11:00', result: allTimeProfitLoss[3] + allTimeProfitLoss[4] },
                { openHour: '12:00', result: todayProfitLoss[0] },
                { openHour: '13:00', result: allTimeProfitLoss[2] },
                { openHour: '14:00', result: todayProfitLoss[1] + thisWeekProfitLoss[0] + thisMonthProfitLoss[0] },
                { openHour: '16:00', result: thisWeekProfitLoss[1] + thisMonthProfitLoss[1] + allTimeProfitLoss[1] },
                { openHour: '17:00', result: allTimeProfitLoss[0] },
            ]
        };
        test('it outputs the correct result', function () {
            expect(putInSameOrder(result, expectedResult)).toEqual(expectedResult);
        });
    });
    describe('When accountData.trades has more than 1 trade, all random', function () {
        // 8th February, 2022
        var today = new Date(2022, 1, 8);
        var _a = generateTrades(today), todayTrades = _a[0], thisWeekTrades = _a[1], thisMonthTrades = _a[2], thisYearTrades = _a[3], allTimeTrades = _a[4];
        var accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: __spreadArray([], allTimeTrades, true)
        };
        var result = (0, time_analysis_graph_calc_1.default)(accountData, today);
        var expectedResult = {
            todayGraphCalc: graphCalc(todayTrades),
            thisWeekGraphCalc: graphCalc(thisWeekTrades),
            thisMonthGraphCalc: graphCalc(thisMonthTrades),
            thisYearGraphCalc: graphCalc(thisYearTrades),
            allTimeGraphCalc: graphCalc(allTimeTrades)
        };
        test('it outputs the correct result', function () {
            expect(putInSameOrder(result, expectedResult)).toEqual(expectedResult);
        });
    });
    describe('When accountData.trades has more than 10000 trades, all random', function () {
        // 8th February, 2022
        var today = new Date(2022, 1, 8);
        var _a = generateTrades(today, 10001, 20000), todayTrades = _a[0], thisWeekTrades = _a[1], thisMonthTrades = _a[2], thisYearTrades = _a[3], allTimeTrades = _a[4];
        var accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: __spreadArray([], allTimeTrades, true)
        };
        var result = (0, time_analysis_graph_calc_1.default)(accountData, today);
        var expectedResult = {
            todayGraphCalc: graphCalc(todayTrades),
            thisWeekGraphCalc: graphCalc(thisWeekTrades),
            thisMonthGraphCalc: graphCalc(thisMonthTrades),
            thisYearGraphCalc: graphCalc(thisYearTrades),
            allTimeGraphCalc: graphCalc(allTimeTrades)
        };
        test('it outputs the correct result', function () {
            expect(putInSameOrder(result, expectedResult)).toEqual(expectedResult);
        });
    });
});
//# sourceMappingURL=time-analysis-graph-calc.test.js.map