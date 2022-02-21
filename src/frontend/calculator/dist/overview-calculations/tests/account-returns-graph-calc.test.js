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
var account_returns_graph_calc_1 = __importDefault(require("../account-returns-graph-calc"));
describe('Verify accountReturnsGraphCalc is working', function () {
    // Deposits and withdrawals are not needed for these tests,
    // because they aren't used to calculate anything for the 
    // account returns graph
    var dummyDeposits = [];
    var dummyWithdrawals = [];
    describe('When accountData.trades is empty (meaning no trades)', function () {
        var dummyTrades = [];
        var dummyAccountData = {
            name: 'dummy account',
            deposits: dummyDeposits,
            withdrawals: dummyWithdrawals,
            trades: dummyTrades
        };
        var result = (0, account_returns_graph_calc_1.default)(dummyAccountData);
        // This defaultCalc is what all fields in the calc should have when
        // there are no trades
        var defaultCalc = [{ tradeNo: 0, result: 0 }];
        var expectedResult = {
            todayGraphCalc: defaultCalc,
            thisWeekGraphCalc: defaultCalc,
            thisMonthGraphCalc: defaultCalc,
            thisYearGraphCalc: defaultCalc,
            allTimeGraphCalc: defaultCalc
        };
        test('result should be only default values', function () {
            expect(result).toEqual(expectedResult);
        });
    });
    describe('When accountData.trades isn\'t empty', function () {
        describe('When the only trade taken is one from last year', function () {
            var today = new Date(2022, 0, 2);
            // No single trade taken in today's year
            var trades = [
                {
                    pair: 'GBPUSD',
                    action: 'buy',
                    openTime: '2021-02-01T18:34:00Z',
                    closeTime: '2021-02-01T18:43:00Z',
                    riskRewardRatio: 2.3,
                    profitLoss: 320,
                    pips: 2,
                    notes: '',
                    entryImageLink: '',
                    exitImageLink: '',
                    commission: 32,
                    swap: 32,
                    stopLoss: 0,
                    takeProfit: 0,
                },
            ];
            var dummyAccountData = {
                name: 'dummy account',
                deposits: dummyDeposits,
                withdrawals: dummyWithdrawals,
                trades: trades
            };
            var result = (0, account_returns_graph_calc_1.default)(dummyAccountData, today);
            var defaultCalc = [{ tradeNo: 0, result: 0 }];
            var expectedResult = {
                todayGraphCalc: defaultCalc,
                thisWeekGraphCalc: defaultCalc,
                thisMonthGraphCalc: defaultCalc,
                thisYearGraphCalc: defaultCalc,
                allTimeGraphCalc: __spreadArray(__spreadArray([], defaultCalc, true), [{ tradeNo: 1, result: trades[0].profitLoss }], false)
            };
            test('all results should be default values, except allTime ' +
                'which should have the trade taken the year before today\'s year', function () {
                expect(result).toEqual(expectedResult);
            });
        });
        describe('When the only trade taken is one this year, but not this month', function () {
            // 2nd April, 2022 (TS month field in constructor is 0-based)
            var today = new Date(2022, 3, 2);
            // Trade take on 2nd January, 2022
            var trades = [
                {
                    pair: 'GBPUSD',
                    action: 'buy',
                    openTime: '2022-02-01T18:34:00Z',
                    closeTime: '2022-02-01T18:34:00Z',
                    riskRewardRatio: 2.3,
                    profitLoss: 320,
                    pips: 2,
                    notes: '',
                    entryImageLink: '',
                    exitImageLink: '',
                    commission: 32,
                    swap: 32,
                    stopLoss: 0,
                    takeProfit: 0
                },
            ];
            var dummyAccountData = {
                name: 'dummy account',
                deposits: dummyDeposits,
                withdrawals: dummyWithdrawals,
                trades: trades
            };
            var result = (0, account_returns_graph_calc_1.default)(dummyAccountData, today);
            var defaultCalc = [{ tradeNo: 0, result: 0 }];
            var expectedResult = {
                todayGraphCalc: defaultCalc,
                thisWeekGraphCalc: defaultCalc,
                thisMonthGraphCalc: defaultCalc,
                thisYearGraphCalc: __spreadArray(__spreadArray([], defaultCalc, true), [{ tradeNo: 1, result: trades[0].profitLoss }], false),
                allTimeGraphCalc: __spreadArray(__spreadArray([], defaultCalc, true), [{ tradeNo: 1, result: trades[0].profitLoss }], false)
            };
            test('all results should be default values, except allTime and thisYear ', function () {
                expect(result).toEqual(expectedResult);
            });
        });
        describe('When the only trade taken is one this month, but not this week', function () {
            // 22nd April, 2022 (TS month field in constructor is 0-based)
            var today = new Date(2022, 3, 22);
            // Trade take on 15th April, 2022
            var trades = [
                {
                    pair: 'GBPUSD',
                    action: 'buy',
                    openTime: '2022-04-15T18:34:00Z',
                    closeTime: '2022-04-15T18:34:00Z',
                    riskRewardRatio: 2.3,
                    profitLoss: 320,
                    pips: 2,
                    notes: '',
                    entryImageLink: '',
                    exitImageLink: '',
                    commission: 32,
                    swap: 32,
                    stopLoss: 0,
                    takeProfit: 0
                },
            ];
            var dummyAccountData = {
                name: 'dummy account',
                deposits: dummyDeposits,
                withdrawals: dummyWithdrawals,
                trades: trades
            };
            var result = (0, account_returns_graph_calc_1.default)(dummyAccountData, today);
            var defaultCalc = [{ tradeNo: 0, result: 0 }];
            var expectedResult = {
                todayGraphCalc: defaultCalc,
                thisWeekGraphCalc: defaultCalc,
                thisMonthGraphCalc: __spreadArray(__spreadArray([], defaultCalc, true), [{ tradeNo: 1, result: trades[0].profitLoss }], false),
                thisYearGraphCalc: __spreadArray(__spreadArray([], defaultCalc, true), [{ tradeNo: 1, result: trades[0].profitLoss }], false),
                allTimeGraphCalc: __spreadArray(__spreadArray([], defaultCalc, true), [{ tradeNo: 1, result: trades[0].profitLoss }], false)
            };
            test('all results should be default values, except allTime, thisYear and thisMonth', function () {
                expect(result).toEqual(expectedResult);
            });
        });
        describe('When the only trade taken is one this week, but not today', function () {
            // 22nd April, 2022 (TS month field in constructor is 0-based)
            var today = new Date(2022, 3, 22);
            // Trade take on 19th April, 2022
            var tradeDateStr = '2022-04-19T18:34:00Z';
            var trades = [
                {
                    pair: 'GBPUSD',
                    action: 'buy',
                    openTime: tradeDateStr,
                    closeTime: tradeDateStr,
                    riskRewardRatio: 2.3,
                    profitLoss: 320,
                    pips: 2,
                    notes: '',
                    entryImageLink: '',
                    exitImageLink: '',
                    lots: 2,
                    commission: 32,
                    swap: 32,
                    takeProfit: 0,
                    stopLoss: 0
                },
            ];
            var dummyAccountData = {
                name: 'dummy account',
                deposits: dummyDeposits,
                withdrawals: dummyWithdrawals,
                trades: trades
            };
            var defaultCalc = [{ tradeNo: 0, result: 0 }];
            var result = (0, account_returns_graph_calc_1.default)(dummyAccountData, today);
            var expectedResult = {
                todayGraphCalc: defaultCalc,
                thisWeekGraphCalc: __spreadArray(__spreadArray([], defaultCalc, true), [{ tradeNo: 1, result: trades[0].profitLoss }], false),
                thisMonthGraphCalc: __spreadArray(__spreadArray([], defaultCalc, true), [{ tradeNo: 1, result: trades[0].profitLoss }], false),
                thisYearGraphCalc: __spreadArray(__spreadArray([], defaultCalc, true), [{ tradeNo: 1, result: trades[0].profitLoss }], false),
                allTimeGraphCalc: __spreadArray(__spreadArray([], defaultCalc, true), [{ tradeNo: 1, result: trades[0].profitLoss }], false)
            };
            test('only today\'s results should be default values', function () {
                expect(result).toEqual(expectedResult);
            });
        });
        describe('When the only trade taken is one today', function () {
            // 22nd April, 2022 (TS month field in constructor is 0-based)
            var today = new Date(2022, 3, 22);
            // Trade take on 16th April, 2022
            var tradeDateStr = '2022-04-22T18:34:00Z';
            var trades = [
                {
                    pair: 'GBPUSD',
                    action: 'buy',
                    openTime: tradeDateStr,
                    closeTime: tradeDateStr,
                    riskRewardRatio: 2.3,
                    profitLoss: 320,
                    pips: 2,
                    notes: '',
                    entryImageLink: '',
                    exitImageLink: '',
                    lots: 2,
                    commission: 32,
                    swap: 32,
                    takeProfit: 0,
                    stopLoss: 0
                },
            ];
            var dummyAccountData = {
                name: 'dummy account',
                deposits: dummyDeposits,
                withdrawals: dummyWithdrawals,
                trades: trades
            };
            var result = (0, account_returns_graph_calc_1.default)(dummyAccountData, today);
            var defaultCalc = [{ tradeNo: 0, result: 0 }];
            var expectedResult = {
                todayGraphCalc: __spreadArray(__spreadArray([], defaultCalc, true), [{ tradeNo: 1, result: trades[0].profitLoss }], false),
                thisWeekGraphCalc: __spreadArray(__spreadArray([], defaultCalc, true), [{ tradeNo: 1, result: trades[0].profitLoss }], false),
                thisMonthGraphCalc: __spreadArray(__spreadArray([], defaultCalc, true), [{ tradeNo: 1, result: trades[0].profitLoss }], false),
                thisYearGraphCalc: __spreadArray(__spreadArray([], defaultCalc, true), [{ tradeNo: 1, result: trades[0].profitLoss }], false),
                allTimeGraphCalc: __spreadArray(__spreadArray([], defaultCalc, true), [{ tradeNo: 1, result: trades[0].profitLoss }], false)
            };
            test('all calcs should have the default values and the trade taken today', function () {
                expect(result).toEqual(expectedResult);
            });
        });
        describe('When the a trade is taken today, this week, this month, ' +
            'this year and the previous year', function () {
            // 22nd April, 2022 (TS month field in constructor is 0-based)
            var today = new Date(2022, 3, 22);
            // Trade take on 16th April, 2022
            var todayDateStr = '2022-04-22T18:34:00Z';
            var thisWeekDateStr = '2022-04-20T18:34:00Z';
            var thisMonthDateStr = '2022-04-06T18:34:00Z';
            var thisYearDateStr = '2022-01-13T18:34:00Z';
            var lastYearDateStr = '2021-06-27T18:34:00Z';
            var baseTrade = {
                pair: 'GBPUSD',
                action: 'buy',
                riskRewardRatio: 2.3,
                profitLoss: 320,
                pips: 2,
                notes: '',
                entryImageLink: '',
                exitImageLink: '',
                lots: 2,
                commission: 32,
                swap: 32,
                stopLoss: 0,
                takeProfit: 0,
                openTime: todayDateStr,
                closeTime: todayDateStr
            };
            var trades = [
                __assign(__assign({}, baseTrade), { openTime: todayDateStr, closeTime: todayDateStr }),
                __assign(__assign({}, baseTrade), { openTime: thisWeekDateStr, closeTime: thisWeekDateStr }),
                __assign(__assign({}, baseTrade), { openTime: thisMonthDateStr, closeTime: thisMonthDateStr }),
                __assign(__assign({}, baseTrade), { openTime: thisYearDateStr, closeTime: thisYearDateStr }),
                __assign(__assign({}, baseTrade), { openTime: lastYearDateStr, closeTime: lastYearDateStr })
            ];
            var dummyAccountData = {
                name: 'dummy account',
                deposits: dummyDeposits,
                withdrawals: dummyWithdrawals,
                trades: trades
            };
            var result = (0, account_returns_graph_calc_1.default)(dummyAccountData, today);
            var defaultCalc = [{ tradeNo: 0, result: 0 }];
            var expectedTodayCalc = __spreadArray(__spreadArray([], defaultCalc, true), [{ tradeNo: 1, result: trades[0].profitLoss }], false);
            var expectedThisWeekCalc = __spreadArray(__spreadArray([], expectedTodayCalc, true), [{ tradeNo: 2, result: trades[1].profitLoss }], false);
            var expectedThisMonthCalc = __spreadArray(__spreadArray([], expectedThisWeekCalc, true), [{ tradeNo: 3, result: trades[2].profitLoss }], false);
            var expectedThisYearCalc = __spreadArray(__spreadArray([], expectedThisMonthCalc, true), [{ tradeNo: 4, result: trades[3].profitLoss }], false);
            var expectedAllTimeCalc = __spreadArray(__spreadArray([], expectedThisYearCalc, true), [{ tradeNo: 5, result: trades[4].profitLoss }], false);
            var expectedResult = {
                todayGraphCalc: expectedTodayCalc,
                thisWeekGraphCalc: expectedThisWeekCalc,
                thisMonthGraphCalc: expectedThisMonthCalc,
                thisYearGraphCalc: expectedThisYearCalc,
                allTimeGraphCalc: expectedAllTimeCalc
            };
            test('all calcs should have the default values and the trades taken during ' +
                'their respective periods', function () {
                expect(result).toEqual(expectedResult);
            });
        });
    });
});
//# sourceMappingURL=account-returns-graph-calc.test.js.map