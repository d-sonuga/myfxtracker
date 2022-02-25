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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var weekly_summary_calc_1 = __importStar(require("../weekly-summary-calc"));
/**
 * Note: the tests are far from complete
 */
describe('Verify that getWeekDates is working', function () {
    var testWhenDayIs = function (today, mondayToFriday) {
        var weekDates = (0, weekly_summary_calc_1.getWeekDates)(today);
        for (var i = 0; i < weekDates.length; i++) {
            expect(weekDates[i].getDate()).toEqual(mondayToFriday[i].getDate());
        }
    };
    var testForAllWeekDays = function (SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, mondayToFriday) {
        test('when today is sunday', function () {
            testWhenDayIs(SUNDAY, mondayToFriday);
        });
        test('when today is monday', function () {
            testWhenDayIs(MONDAY, mondayToFriday);
        });
        test('when today is tuesday', function () {
            testWhenDayIs(TUESDAY, mondayToFriday);
        });
        test('when today is wednesday', function () {
            testWhenDayIs(WEDNESDAY, mondayToFriday);
        });
        test('when today is thursday', function () {
            testWhenDayIs(THURSDAY, mondayToFriday);
        });
        test('when today is friday', function () {
            testWhenDayIs(FRIDAY, mondayToFriday);
        });
        test('when today is saturday', function () {
            testWhenDayIs(SATURDAY, mondayToFriday);
        });
    };
    describe('it returns all date objects of 3rd January(Monday) to 7th January(Friday)', function () {
        var YEAR = 2022;
        var JAN = 0;
        // The week days of a week in January 2022
        var SUNDAY = new Date(YEAR, JAN, 2);
        var MONDAY = new Date(YEAR, JAN, 3);
        var TUESDAY = new Date(YEAR, JAN, 4);
        var WEDNESDAY = new Date(YEAR, JAN, 5);
        var THURSDAY = new Date(YEAR, JAN, 6);
        var FRIDAY = new Date(YEAR, JAN, 7);
        var SATURDAY = new Date(YEAR, JAN, 8);
        var mondayToFriday = [
            FRIDAY,
            THURSDAY,
            WEDNESDAY,
            TUESDAY,
            MONDAY
        ];
        testForAllWeekDays(SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, mondayToFriday);
    });
    describe('it returns all date objects of 27th Dec(Monday) to 31st Dec(Friday)', function () {
        var YEAR = 2021;
        var DEC = 11;
        var JAN = 0;
        // The week days of a week in Dec 2021
        var SUNDAY = new Date(YEAR, DEC, 26);
        var MONDAY = new Date(YEAR, DEC, 27);
        var TUESDAY = new Date(YEAR, DEC, 28);
        var WEDNESDAY = new Date(YEAR, DEC, 29);
        var THURSDAY = new Date(YEAR, DEC, 30);
        var FRIDAY = new Date(YEAR, DEC, 31);
        var SATURDAY = new Date(YEAR + 1, JAN, 1);
        var mondayToFriday = [
            FRIDAY,
            THURSDAY,
            WEDNESDAY,
            TUESDAY,
            MONDAY
        ];
        testForAllWeekDays(SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, mondayToFriday);
    });
    describe('it returns all date objects of 31st Jan(Monday) to 4th Feb(Friday)', function () {
        var YEAR = 2021;
        var JAN = 0;
        var FEB = 1;
        // The week days of a week in Dec 2021
        var SUNDAY = new Date(YEAR, JAN, 31);
        var MONDAY = new Date(YEAR, FEB, 1);
        var TUESDAY = new Date(YEAR, FEB, 2);
        var WEDNESDAY = new Date(YEAR, FEB, 3);
        var THURSDAY = new Date(YEAR, FEB, 4);
        var FRIDAY = new Date(YEAR, FEB, 5);
        var SATURDAY = new Date(YEAR, FEB, 6);
        var mondayToFriday = [
            FRIDAY,
            THURSDAY,
            WEDNESDAY,
            TUESDAY,
            MONDAY
        ];
        testForAllWeekDays(SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, mondayToFriday);
    });
});
describe('Verify that weeklySummaryCalc is working', function () {
    // Deposits and withdrawals are not needed for these tests,
    // because they aren't used to calculate anything for the 
    // account returns graph
    var dummyDeposits = [];
    var dummyWithdrawals = [];
    var sumArrayObj = function (array, field) {
        var sum = 0;
        for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
            var obj = array_1[_i];
            if (obj[field] !== undefined) {
                sum += obj[field];
            }
        }
        return sum;
    };
    describe('When no trade in accountData.trades was carried out this week', function () {
        // 21st April, 2022
        var today = new Date(2022, 3, 21);
        // 2nd January, 2021
        var tradeDateStr = '2021-01-02';
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
                stopLoss: 0,
                takeProfit: 0,
                openPrice: 0,
                closePrice: 0
            },
        ];
        var dummyAccountData = {
            name: 'dummy name',
            deposits: dummyDeposits,
            withdrawals: dummyWithdrawals,
            trades: trades
        };
        var result = (0, weekly_summary_calc_1.default)(dummyAccountData, today);
        var defaultSummaryResult = { trades: 0, lots: 0, result: 0 };
        var expectedResult = {
            '18 Apr': defaultSummaryResult,
            '19 Apr': defaultSummaryResult,
            '20 Apr': defaultSummaryResult,
            '21 Apr': defaultSummaryResult,
            '22 Apr': defaultSummaryResult,
        };
        test('all days of the week have the default summary result', function () {
            expect(result).toEqual(expectedResult);
        });
    });
    describe('When some trades where carried out this week', function () {
        /**
         * @param dateStr: which date should the trades have
         * @param noOfTrades: how many trades should the accountData have
         * @returns: accountData with noOfTrades trades all done on dateStr
         */
        var accountDataWithTradesOnDate = function (dateStr, noOfTrades) {
            var trades = [];
            for (var i = noOfTrades; i > 0; i--) {
                trades.push({
                    pair: 'GBPUSD',
                    action: 'buy',
                    openTime: dateStr,
                    closeTime: dateStr,
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
                    openPrice: 0,
                    closePrice: 0
                });
            }
            return {
                name: 'dummy name',
                deposits: dummyDeposits,
                withdrawals: dummyWithdrawals,
                trades: trades
            };
        };
        describe('Trades only on Monday', function () {
            // Thursday 21st April, 2022
            var today = new Date(2022, 3, 21);
            // Monday 18th April, 2022
            var tradeDateStr = '2022-04-18T18:34:00Z';
            // Using the 1st trade set
            var dummyAccountData1 = accountDataWithTradesOnDate(tradeDateStr, 1);
            // Using the 2nd trade set
            var dummyAccountData2 = accountDataWithTradesOnDate(tradeDateStr, 17);
            var dummyAccountData3 = accountDataWithTradesOnDate(tradeDateStr, 232);
            var result1 = (0, weekly_summary_calc_1.default)(dummyAccountData1, today);
            var result2 = (0, weekly_summary_calc_1.default)(dummyAccountData2, today);
            var result3 = (0, weekly_summary_calc_1.default)(dummyAccountData3, today);
            var defaultSummaryResult = { trades: 0, lots: 0, result: 0 };
            var baseExpectedResult = {
                '19 Apr': defaultSummaryResult,
                '20 Apr': defaultSummaryResult,
                '21 Apr': defaultSummaryResult,
                '22 Apr': defaultSummaryResult,
            };
            var expectedResult1 = __assign({ '18 Apr': { trades: dummyAccountData1.trades.length,
                    lots: sumArrayObj(dummyAccountData1.trades, 'lots'),
                    result: sumArrayObj(dummyAccountData1.trades, 'profitLoss') } }, baseExpectedResult);
            var expectedResult2 = __assign({ '18 Apr': { trades: dummyAccountData2.trades.length,
                    lots: sumArrayObj(dummyAccountData2.trades, 'lots'),
                    result: sumArrayObj(dummyAccountData2.trades, 'profitLoss') } }, baseExpectedResult);
            var expectedResult3 = __assign({ '18 Apr': { trades: dummyAccountData3.trades.length,
                    lots: sumArrayObj(dummyAccountData3.trades, 'lots'),
                    result: sumArrayObj(dummyAccountData3.trades, 'profitLoss') } }, baseExpectedResult);
            test('all days of the week have the default summary result except Monday', function () {
                expect(result1).toEqual(expectedResult1);
                expect(result2).toEqual(expectedResult2);
                expect(result3).toEqual(expectedResult3);
            });
        });
        describe('Trades only on Tuesday', function () {
            // Thursday 21st April, 2022
            var today = new Date(2022, 3, 21);
            // Tuesday 19th April, 2022
            var tradeDateStr = '2022-04-19T18:34:00Z';
            var dummyAccountData1 = accountDataWithTradesOnDate(tradeDateStr, 1);
            var dummyAccountData2 = accountDataWithTradesOnDate(tradeDateStr, 17);
            var dummyAccountData3 = accountDataWithTradesOnDate(tradeDateStr, 232);
            var result1 = (0, weekly_summary_calc_1.default)(dummyAccountData1, today);
            var result2 = (0, weekly_summary_calc_1.default)(dummyAccountData2, today);
            var result3 = (0, weekly_summary_calc_1.default)(dummyAccountData3, today);
            var defaultSummaryResult = { trades: 0, lots: 0, result: 0 };
            var baseExpectedResult = {
                '18 Apr': defaultSummaryResult,
                '20 Apr': defaultSummaryResult,
                '21 Apr': defaultSummaryResult,
                '22 Apr': defaultSummaryResult,
            };
            var expectedResult1 = __assign({ '19 Apr': { trades: dummyAccountData1.trades.length,
                    lots: sumArrayObj(dummyAccountData1.trades, 'lots'),
                    result: sumArrayObj(dummyAccountData1.trades, 'profitLoss') } }, baseExpectedResult);
            var expectedResult2 = __assign({ '19 Apr': { trades: dummyAccountData2.trades.length,
                    lots: sumArrayObj(dummyAccountData2.trades, 'lots'),
                    result: sumArrayObj(dummyAccountData2.trades, 'profitLoss') } }, baseExpectedResult);
            var expectedResult3 = __assign({ '19 Apr': { trades: dummyAccountData3.trades.length,
                    lots: sumArrayObj(dummyAccountData3.trades, 'lots'),
                    result: sumArrayObj(dummyAccountData3.trades, 'profitLoss') } }, baseExpectedResult);
            test('all days of the week have the default summary result except Tuesday', function () {
                expect(result1).toEqual(expectedResult1);
                expect(result2).toEqual(expectedResult2);
                expect(result3).toEqual(expectedResult3);
            });
        });
        describe('Trades only on Wednesday', function () {
            // Thursday 21st April, 2022
            var today = new Date(2022, 3, 21);
            // Monday 18th April, 2022, not in today's week
            var tradeDateStr = '2022-04-20T18:34:00Z';
            var dummyAccountData1 = accountDataWithTradesOnDate(tradeDateStr, 1);
            var dummyAccountData2 = accountDataWithTradesOnDate(tradeDateStr, 17);
            var dummyAccountData3 = accountDataWithTradesOnDate(tradeDateStr, 232);
            var result1 = (0, weekly_summary_calc_1.default)(dummyAccountData1, today);
            var result2 = (0, weekly_summary_calc_1.default)(dummyAccountData2, today);
            var result3 = (0, weekly_summary_calc_1.default)(dummyAccountData3, today);
            var defaultSummaryResult = { trades: 0, lots: 0, result: 0 };
            var baseExpectedResult = {
                '18 Apr': defaultSummaryResult,
                '19 Apr': defaultSummaryResult,
                '21 Apr': defaultSummaryResult,
                '22 Apr': defaultSummaryResult,
            };
            var expectedResult1 = __assign({ '20 Apr': { trades: dummyAccountData1.trades.length,
                    lots: sumArrayObj(dummyAccountData1.trades, 'lots'),
                    result: sumArrayObj(dummyAccountData1.trades, 'profitLoss') } }, baseExpectedResult);
            var expectedResult2 = __assign({ '20 Apr': { trades: dummyAccountData2.trades.length,
                    lots: sumArrayObj(dummyAccountData2.trades, 'lots'),
                    result: sumArrayObj(dummyAccountData2.trades, 'profitLoss') } }, baseExpectedResult);
            var expectedResult3 = __assign({ '20 Apr': { trades: dummyAccountData3.trades.length,
                    lots: sumArrayObj(dummyAccountData3.trades, 'lots'),
                    result: sumArrayObj(dummyAccountData3.trades, 'profitLoss') } }, baseExpectedResult);
            test('all days of the week have the default summary result except Wednesday', function () {
                expect(result1).toEqual(expectedResult1);
                expect(result2).toEqual(expectedResult2);
                expect(result3).toEqual(expectedResult3);
            });
        });
        describe('Trades only on Thursday', function () {
            // Thursday 21st April, 2022
            var today = new Date(2022, 3, 21);
            // Thursday 21st April, 2022
            var tradeDateStr = '2022-04-21T18:34:00Z';
            var dummyAccountData1 = accountDataWithTradesOnDate(tradeDateStr, 1);
            var dummyAccountData2 = accountDataWithTradesOnDate(tradeDateStr, 17);
            var dummyAccountData3 = accountDataWithTradesOnDate(tradeDateStr, 232);
            var result1 = (0, weekly_summary_calc_1.default)(dummyAccountData1, today);
            var result2 = (0, weekly_summary_calc_1.default)(dummyAccountData2, today);
            var result3 = (0, weekly_summary_calc_1.default)(dummyAccountData3, today);
            var defaultSummaryResult = { trades: 0, lots: 0, result: 0 };
            var baseExpectedResult = {
                '18 Apr': defaultSummaryResult,
                '19 Apr': defaultSummaryResult,
                '20 Apr': defaultSummaryResult,
                '22 Apr': defaultSummaryResult,
            };
            var expectedResult1 = __assign({ '21 Apr': { trades: dummyAccountData1.trades.length,
                    lots: sumArrayObj(dummyAccountData1.trades, 'lots'),
                    result: sumArrayObj(dummyAccountData1.trades, 'profitLoss') } }, baseExpectedResult);
            var expectedResult2 = __assign({ '21 Apr': { trades: dummyAccountData2.trades.length,
                    lots: sumArrayObj(dummyAccountData2.trades, 'lots'),
                    result: sumArrayObj(dummyAccountData2.trades, 'profitLoss') } }, baseExpectedResult);
            var expectedResult3 = __assign({ '21 Apr': { trades: dummyAccountData3.trades.length,
                    lots: sumArrayObj(dummyAccountData3.trades, 'lots'),
                    result: sumArrayObj(dummyAccountData3.trades, 'profitLoss') } }, baseExpectedResult);
            test('all days of the week have the default summary result except Thursday', function () {
                expect(result1).toEqual(expectedResult1);
                expect(result2).toEqual(expectedResult2);
                expect(result3).toEqual(expectedResult3);
            });
        });
        describe('Trades only on Friday', function () {
            // Thursday 21st April, 2022
            var today = new Date(2022, 3, 21);
            // Friday 22nd April, 2022
            var tradeDateStr = '2022-04-22T18:34:00Z';
            var dummyAccountData1 = accountDataWithTradesOnDate(tradeDateStr, 1);
            var dummyAccountData2 = accountDataWithTradesOnDate(tradeDateStr, 17);
            var dummyAccountData3 = accountDataWithTradesOnDate(tradeDateStr, 232);
            var result1 = (0, weekly_summary_calc_1.default)(dummyAccountData1, today);
            var result2 = (0, weekly_summary_calc_1.default)(dummyAccountData2, today);
            var result3 = (0, weekly_summary_calc_1.default)(dummyAccountData3, today);
            var defaultSummaryResult = { trades: 0, lots: 0, result: 0 };
            var baseExpectedResult = {
                '18 Apr': defaultSummaryResult,
                '19 Apr': defaultSummaryResult,
                '20 Apr': defaultSummaryResult,
                '21 Apr': defaultSummaryResult,
            };
            var expectedResult1 = __assign({ '22 Apr': { trades: dummyAccountData1.trades.length,
                    lots: sumArrayObj(dummyAccountData1.trades, 'lots'),
                    result: sumArrayObj(dummyAccountData1.trades, 'profitLoss') } }, baseExpectedResult);
            var expectedResult2 = __assign({ '22 Apr': { trades: dummyAccountData2.trades.length,
                    lots: sumArrayObj(dummyAccountData2.trades, 'lots'),
                    result: sumArrayObj(dummyAccountData2.trades, 'profitLoss') } }, baseExpectedResult);
            var expectedResult3 = __assign({ '22 Apr': { trades: dummyAccountData3.trades.length,
                    lots: sumArrayObj(dummyAccountData3.trades, 'lots'),
                    result: sumArrayObj(dummyAccountData3.trades, 'profitLoss') } }, baseExpectedResult);
            test('all days of the week have the default summary result except Friday', function () {
                expect(result1).toEqual(expectedResult1);
                expect(result2).toEqual(expectedResult2);
                expect(result3).toEqual(expectedResult3);
            });
        });
    });
});
//# sourceMappingURL=weekly-summary-calc.test.js.map