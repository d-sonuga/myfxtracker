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
var lodash_1 = __importDefault(require("lodash"));
var trade_duration_table_calc_1 = __importDefault(require("../trade-duration-table-calc"));
var utils_1 = require("./utils");
describe('Verify tradeDurationTableCalc is working', function () {
    describe('When there are no trades', function () {
        var accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: []
        };
        var result = (0, trade_duration_table_calc_1.default)(accountData);
        var expectedResult = [];
        test('it outputs an empty array', function () {
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
                    pair: 'USDSEK',
                    action: 'sell',
                    openTime: '2022-10-03T12:43:00Z',
                    closeTime: '2022-10-03T12:53:00Z',
                    takeProfit: 0,
                    stopLoss: 0,
                    riskRewardRatio: 0,
                    profitLoss: 200
                }
            ]
        };
        var result = (0, trade_duration_table_calc_1.default)(accountData);
        var expectedResult = [
            { duration: '10 mins', noOfTrades: 1, result: 200 }
        ];
        test('it outputs the correct result', function () {
            expect(result).toEqual(expectedResult);
        });
    });
    describe('When there is more than 1 trade', function () {
        var baseTrade = {
            pair: 'USDSEK',
            action: 'sell',
            takeProfit: 0,
            stopLoss: 0,
            riskRewardRatio: 0
        };
        var profitLoss10mins = [12, 32, -455];
        var profitLoss34mins = [244];
        var profitLoss1min = [233, -1000, 3];
        var profitLoss51mins = [32];
        var profitLoss59mins = [-100000, 34, 22];
        var profitLoss1hour = [200, 344, -10];
        var profitLoss9hours = [34, -1900];
        var profitLoss1day = [344, -90, 3];
        var profitLoss4days = [899, 34, -10000];
        var profitLoss1week = [3, -1000000];
        var profitLoss3weeks = [344, 3];
        var profitLoss3weeks4days = [-200];
        var profitLoss1month = [3444, -433];
        var profitLoss3months = [433, 2345];
        var profitLoss11months = [324];
        var profitLoss11months3weeks = [324];
        var profitLoss11months3weeks4days = [345];
        var profitLoss1year = [544, -100];
        var profitLoss3years = [43, -2];
        var accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: [
                __assign(__assign({}, baseTrade), { openTime: '2022-10-03T12:43:00Z', closeTime: '2022-10-03T12:53:00Z', profitLoss: profitLoss10mins[0] }),
                __assign(__assign({}, baseTrade), { openTime: '2021-10-04T13:14:00Z', closeTime: '2021-10-04T13:24:00Z', profitLoss: profitLoss10mins[1] }),
                __assign(__assign({}, baseTrade), { openTime: '2020-01-23T14:27:00Z', closeTime: '2020-01-23T14:37:00Z', profitLoss: profitLoss10mins[2] }),
                __assign(__assign({}, baseTrade), { openTime: '2019-01-23T12:17:00Z', closeTime: '2019-01-23T12:51:00Z', profitLoss: profitLoss34mins[0] }),
                __assign(__assign({}, baseTrade), { openTime: '2019-12-03T12:17:00Z', closeTime: '2019-12-03T12:18:00Z', profitLoss: profitLoss1min[0] }),
                __assign(__assign({}, baseTrade), { openTime: '2019-12-03T13:27:00Z', closeTime: '2019-12-03T13:28:00Z', profitLoss: profitLoss1min[1] }),
                __assign(__assign({}, baseTrade), { openTime: '2019-12-03T12:59:00Z', closeTime: '2019-12-03T01:00:00Z', profitLoss: profitLoss1min[2] }),
                __assign(__assign({}, baseTrade), { openTime: '2019-12-03T12:00:00Z', closeTime: '2019-12-03T12:51:00Z', profitLoss: profitLoss51mins[0] }),
                __assign(__assign({}, baseTrade), { openTime: '2019-12-03T12:00:00Z', closeTime: '2019-12-03T12:59:00Z', profitLoss: profitLoss59mins[0] }),
                __assign(__assign({}, baseTrade), { openTime: '2017-12-03T12:01:00Z', closeTime: '2017-12-03T13:00:00Z', profitLoss: profitLoss59mins[1] }),
                __assign(__assign({}, baseTrade), { openTime: '2000-12-03T12:00:00Z', closeTime: '2000-12-03T12:59:00Z', profitLoss: profitLoss59mins[2] }),
                __assign(__assign({}, baseTrade), { openTime: '2019-12-03T12:00:00Z', closeTime: '2019-12-03T13:00:00Z', profitLoss: profitLoss1hour[0] }),
                __assign(__assign({}, baseTrade), { openTime: '2010-12-03T12:00:00Z', closeTime: '2010-12-03T13:20:00Z', profitLoss: profitLoss1hour[1] }),
                __assign(__assign({}, baseTrade), { openTime: '2010-12-03T11:00:00Z', closeTime: '2010-12-03T12:00:00Z', profitLoss: profitLoss1hour[2] }),
                __assign(__assign({}, baseTrade), { openTime: '2010-12-03T09:09:00Z', closeTime: '2010-12-03T18:00:00Z', profitLoss: profitLoss9hours[0] }),
                __assign(__assign({}, baseTrade), { openTime: '2010-12-03T10:00:00Z', closeTime: '2010-12-03T19:00:00Z', profitLoss: profitLoss9hours[1] }),
                __assign(__assign({}, baseTrade), { openTime: '2010-12-03T11:00:00Z', closeTime: '2010-12-04T16:00:00Z', profitLoss: profitLoss1day[0] }),
                __assign(__assign({}, baseTrade), { openTime: '2011-11-03T11:12:00Z', closeTime: '2011-11-04T08:10:00Z', profitLoss: profitLoss1day[1] }),
                __assign(__assign({}, baseTrade), { openTime: '2011-01-31T11:12:00Z', closeTime: '2011-02-01T08:10:00Z', profitLoss: profitLoss1day[2] }),
                __assign(__assign({}, baseTrade), { openTime: '2011-11-03T11:12:00Z', closeTime: '2011-11-07T08:10:00Z', profitLoss: profitLoss4days[0] }),
                __assign(__assign({}, baseTrade), { openTime: '2013-11-03T11:12:00Z', closeTime: '2013-11-07T08:10:00Z', profitLoss: profitLoss4days[1] }),
                __assign(__assign({}, baseTrade), { openTime: '2015-11-03T11:12:00Z', closeTime: '2015-11-07T08:10:00Z', profitLoss: profitLoss4days[2] }),
                __assign(__assign({}, baseTrade), { openTime: '2011-11-03T11:12:00Z', closeTime: '2011-11-10T08:10:00Z', profitLoss: profitLoss1week[0] }),
                __assign(__assign({}, baseTrade), { openTime: '2011-03-23T11:12:00Z', closeTime: '2011-03-30T08:10:00Z', profitLoss: profitLoss1week[1] }),
                __assign(__assign({}, baseTrade), { openTime: '2011-02-02T11:12:00Z', closeTime: '2011-02-23T08:10:00Z', profitLoss: profitLoss3weeks[0] }),
                __assign(__assign({}, baseTrade), { openTime: '2012-07-25T11:12:00Z', closeTime: '2012-08-17T08:10:00Z', profitLoss: profitLoss3weeks[1] }),
                __assign(__assign({}, baseTrade), { openTime: '2013-02-02T11:12:00Z', closeTime: '2013-02-27T08:10:00Z', profitLoss: profitLoss3weeks4days[0] }),
                __assign(__assign({}, baseTrade), { openTime: '2013-02-02T11:12:00Z', closeTime: '2013-03-02T08:10:00Z', profitLoss: profitLoss1month[0] }),
                __assign(__assign({}, baseTrade), { openTime: '2013-03-02T11:12:00Z', closeTime: '2013-04-12T08:10:00Z', profitLoss: profitLoss1month[1] }),
                __assign(__assign({}, baseTrade), { openTime: '2013-02-02T11:12:00Z', closeTime: '2013-05-02T08:10:00Z', profitLoss: profitLoss3months[0] }),
                __assign(__assign({}, baseTrade), { openTime: '2013-05-12T11:12:00Z', closeTime: '2013-08-13T08:10:00Z', profitLoss: profitLoss3months[1] }),
                __assign(__assign({}, baseTrade), { openTime: '2013-05-12T08:10:00Z', closeTime: '2014-04-09T08:10:00Z', profitLoss: profitLoss11months[0] }),
                __assign(__assign({}, baseTrade), { openTime: '2013-05-12T11:12:00Z', closeTime: '2014-05-03T08:10:00Z', profitLoss: profitLoss11months3weeks[0] }),
                __assign(__assign({}, baseTrade), { openTime: '2013-05-12T11:12:00Z', closeTime: '2014-04-11T08:10:00Z', profitLoss: profitLoss11months3weeks4days[0] }),
                __assign(__assign({}, baseTrade), { openTime: '2013-02-02T11:12:00Z', closeTime: '2014-05-02T08:10:00Z', profitLoss: profitLoss1year[0] }),
                __assign(__assign({}, baseTrade), { openTime: '2010-02-03T11:12:00Z', closeTime: '2011-05-05T08:10:00Z', profitLoss: profitLoss1year[1] }),
                __assign(__assign({}, baseTrade), { openTime: '2013-02-02T11:12:00Z', closeTime: '2016-05-02T08:10:00Z', profitLoss: profitLoss3years[0] }),
                __assign(__assign({}, baseTrade), { openTime: '2011-02-02T11:12:00Z', closeTime: '2014-05-02T08:10:00Z', profitLoss: profitLoss3years[1] }),
            ]
        };
        var result = (0, trade_duration_table_calc_1.default)(accountData);
        var expectedResult = [
            { duration: '10 mins', noOfTrades: profitLoss10mins.length, result: lodash_1.default.sum(profitLoss10mins) },
            { duration: '34 mins', noOfTrades: profitLoss34mins.length, result: lodash_1.default.sum(profitLoss34mins) },
            { duration: '1 min', noOfTrades: profitLoss1min.length, result: lodash_1.default.sum(profitLoss1min) },
            { duration: '1 hour',
                noOfTrades: profitLoss59mins.length + profitLoss1hour.length + profitLoss51mins.length,
                result: lodash_1.default.sum(profitLoss59mins) + lodash_1.default.sum(profitLoss1hour) + lodash_1.default.sum(profitLoss51mins) },
            { duration: '9 hours', noOfTrades: profitLoss9hours.length, result: lodash_1.default.sum(profitLoss9hours) },
            { duration: '1 day', noOfTrades: profitLoss1day.length,
                result: lodash_1.default.sum(profitLoss1day) },
            {
                duration: '1 week',
                noOfTrades: profitLoss1week.length + profitLoss4days.length,
                result: lodash_1.default.sum(profitLoss1week) + lodash_1.default.sum(profitLoss4days)
            },
            { duration: '3 weeks', noOfTrades: profitLoss3weeks.length, result: lodash_1.default.sum(profitLoss3weeks) },
            { duration: '1 month', noOfTrades: profitLoss1month.length + profitLoss3weeks4days.length,
                result: lodash_1.default.sum(profitLoss1month) + lodash_1.default.sum(profitLoss3weeks4days) },
            { duration: '3 months', noOfTrades: profitLoss3months.length, result: lodash_1.default.sum(profitLoss3months) },
            { duration: '11 months', noOfTrades: profitLoss11months.length,
                result: lodash_1.default.sum(profitLoss11months) },
            {
                duration: '1 year',
                noOfTrades: profitLoss1year.length + profitLoss11months3weeks.length
                    + profitLoss11months3weeks4days.length,
                result: lodash_1.default.sum(profitLoss1year) + lodash_1.default.sum(profitLoss11months3weeks4days)
                    + lodash_1.default.sum(profitLoss11months3weeks)
            },
            { duration: '3 years', noOfTrades: profitLoss3years.length, result: lodash_1.default.sum(profitLoss3years) }
        ];
        test('it outputs the correct result', function () {
            expect((0, utils_1.putInSameOrder)(result, expectedResult, 'duration')).toEqual(expectedResult);
        });
    });
});
//# sourceMappingURL=trade-duration-table-calc.test.js.map