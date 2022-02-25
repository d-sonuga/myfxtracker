import _ from 'lodash'
import {TradeDurationTableCalc} from '@root/index'
import {AccountData, Trade} from '@root/types'
import tradeDurationTableCalc from '../trade-duration-table-calc'
import {putInSameOrder} from './utils'


describe('Verify tradeDurationTableCalc is working', () => {
    describe('When there are no trades', () => {
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: []
        }
        const result = tradeDurationTableCalc(accountData);
        const expectedResult: TradeDurationTableCalc = [];
        test('it outputs an empty array', () => {
            expect(result).toEqual(expectedResult);
        })
    })
    describe('When there is 1 trade', () => {
        const accountData: AccountData = {
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
                    profitLoss: 200,
                    openPrice: 0,
                    closePrice: 0
                }
            ]
        }
        const result = tradeDurationTableCalc(accountData);
        const expectedResult: TradeDurationTableCalc = [
            {duration: '10 mins', noOfTrades: 1, result: 200}
        ]
        test('it outputs the correct result', () => {
            expect(result).toEqual(expectedResult);
        })
    })
    describe('When there is more than 1 trade', () => {
        const baseTrade: Omit<Trade, 'openTime' | 'closeTime' | 'profitLoss'> = {
            pair: 'USDSEK',
            action: 'sell',
            takeProfit: 0,
            stopLoss: 0,
            riskRewardRatio: 0,
            openPrice: 0,
            closePrice: 0
        }
        const profitLoss10mins = [12, 32, -455];
        const profitLoss34mins = [244];
        const profitLoss1min = [233, -1000, 3];
        const profitLoss51mins = [32];
        const profitLoss59mins = [-100000, 34, 22];
        const profitLoss1hour = [200, 344, -10];
        const profitLoss9hours = [34, -1900];
        const profitLoss1day = [344, -90, 3];
        const profitLoss4days = [899, 34, -10000];
        const profitLoss1week = [3, -1000000];
        const profitLoss3weeks = [344, 3];
        const profitLoss3weeks4days = [-200];
        const profitLoss1month = [3444, -433];
        const profitLoss3months = [433, 2345];
        const profitLoss11months = [324];
        const profitLoss11months3weeks = [324];
        const profitLoss11months3weeks4days = [345];
        const profitLoss1year = [544, -100];
        const profitLoss3years = [43, -2];
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: [
                {
                    ...baseTrade,
                    openTime: '2022-10-03T12:43:00Z',
                    closeTime: '2022-10-03T12:53:00Z',
                    profitLoss: profitLoss10mins[0]
                },
                {
                    ...baseTrade,
                    openTime: '2021-10-04T13:14:00Z',
                    closeTime: '2021-10-04T13:24:00Z',
                    profitLoss: profitLoss10mins[1]
                },
                {
                    ...baseTrade,
                    openTime: '2020-01-23T14:27:00Z',
                    closeTime: '2020-01-23T14:37:00Z',
                    profitLoss: profitLoss10mins[2]
                },
                {
                    ...baseTrade,
                    openTime: '2019-01-23T12:17:00Z',
                    closeTime: '2019-01-23T12:51:00Z',
                    profitLoss: profitLoss34mins[0]
                },
                {
                    ...baseTrade,
                    openTime: '2019-12-03T12:17:00Z',
                    closeTime: '2019-12-03T12:18:00Z',
                    profitLoss: profitLoss1min[0]
                },
                {
                    ...baseTrade,
                    openTime: '2019-12-03T13:27:00Z',
                    closeTime: '2019-12-03T13:28:00Z',
                    profitLoss: profitLoss1min[1]
                },
                {
                    ...baseTrade,
                    openTime: '2019-12-03T12:59:00Z',
                    closeTime: '2019-12-03T01:00:00Z',
                    profitLoss: profitLoss1min[2]
                },
                {
                    ...baseTrade,
                    openTime: '2019-12-03T12:00:00Z',
                    closeTime: '2019-12-03T12:51:00Z',
                    profitLoss: profitLoss51mins[0]
                },
                {
                    ...baseTrade,
                    openTime: '2019-12-03T12:00:00Z',
                    closeTime: '2019-12-03T12:59:00Z',
                    profitLoss: profitLoss59mins[0]
                },
                {
                    ...baseTrade,
                    openTime: '2017-12-03T12:01:00Z',
                    closeTime: '2017-12-03T13:00:00Z',
                    profitLoss: profitLoss59mins[1]
                },
                {
                    ...baseTrade,
                    openTime: '2000-12-03T12:00:00Z',
                    closeTime: '2000-12-03T12:59:00Z',
                    profitLoss: profitLoss59mins[2]
                },
                {
                    ...baseTrade,
                    openTime: '2019-12-03T12:00:00Z',
                    closeTime: '2019-12-03T13:00:00Z',
                    profitLoss: profitLoss1hour[0]
                },
                {
                    ...baseTrade,
                    openTime: '2010-12-03T12:00:00Z',
                    closeTime: '2010-12-03T13:20:00Z',
                    profitLoss: profitLoss1hour[1]
                },
                {
                    ...baseTrade,
                    openTime: '2010-12-03T11:00:00Z',
                    closeTime: '2010-12-03T12:00:00Z',
                    profitLoss: profitLoss1hour[2]
                },
                {
                    ...baseTrade,
                    openTime: '2010-12-03T09:09:00Z',
                    closeTime: '2010-12-03T18:00:00Z',
                    profitLoss: profitLoss9hours[0]
                },
                {
                    ...baseTrade,
                    openTime: '2010-12-03T10:00:00Z',
                    closeTime: '2010-12-03T19:00:00Z',
                    profitLoss: profitLoss9hours[1]
                },
                {
                    ...baseTrade,
                    openTime: '2010-12-03T11:00:00Z',
                    closeTime: '2010-12-04T16:00:00Z',
                    profitLoss: profitLoss1day[0]
                },
                {
                    ...baseTrade,
                    openTime: '2011-11-03T11:12:00Z',
                    closeTime: '2011-11-04T08:10:00Z',
                    profitLoss: profitLoss1day[1]
                },
                {
                    ...baseTrade,
                    openTime: '2011-01-31T11:12:00Z',
                    closeTime: '2011-02-01T08:10:00Z',
                    profitLoss: profitLoss1day[2]
                },
                {
                    ...baseTrade,
                    openTime: '2011-11-03T11:12:00Z',
                    closeTime: '2011-11-07T08:10:00Z',
                    profitLoss: profitLoss4days[0]
                },
                {
                    ...baseTrade,
                    openTime: '2013-11-03T11:12:00Z',
                    closeTime: '2013-11-07T08:10:00Z',
                    profitLoss: profitLoss4days[1]
                },
                {
                    ...baseTrade,
                    openTime: '2015-11-03T11:12:00Z',
                    closeTime: '2015-11-07T08:10:00Z',
                    profitLoss: profitLoss4days[2]
                },
                {
                    ...baseTrade,
                    openTime: '2011-11-03T11:12:00Z',
                    closeTime: '2011-11-10T08:10:00Z',
                    profitLoss: profitLoss1week[0]
                },
                {
                    ...baseTrade,
                    openTime: '2011-03-23T11:12:00Z',
                    closeTime: '2011-03-30T08:10:00Z',
                    profitLoss: profitLoss1week[1]
                },
                {
                    ...baseTrade,
                    openTime: '2011-02-02T11:12:00Z',
                    closeTime: '2011-02-23T08:10:00Z',
                    profitLoss: profitLoss3weeks[0]
                },
                {
                    ...baseTrade,
                    openTime: '2012-07-25T11:12:00Z',
                    closeTime: '2012-08-17T08:10:00Z',
                    profitLoss: profitLoss3weeks[1]
                },
                {
                    ...baseTrade,
                    openTime: '2013-02-02T11:12:00Z',
                    closeTime: '2013-02-27T08:10:00Z',
                    profitLoss: profitLoss3weeks4days[0]
                },
                {
                    ...baseTrade,
                    openTime: '2013-02-02T11:12:00Z',
                    closeTime: '2013-03-02T08:10:00Z',
                    profitLoss: profitLoss1month[0]
                },
                {
                    ...baseTrade,
                    openTime: '2013-03-02T11:12:00Z',
                    closeTime: '2013-04-12T08:10:00Z',
                    profitLoss: profitLoss1month[1]
                },
                {
                    ...baseTrade,
                    openTime: '2013-02-02T11:12:00Z',
                    closeTime: '2013-05-02T08:10:00Z',
                    profitLoss: profitLoss3months[0]
                },
                {
                    ...baseTrade,
                    openTime: '2013-05-12T11:12:00Z',
                    closeTime: '2013-08-13T08:10:00Z',
                    profitLoss: profitLoss3months[1]
                },
                {
                    ...baseTrade,
                    openTime: '2013-05-12T08:10:00Z',
                    closeTime: '2014-04-09T08:10:00Z',
                    profitLoss: profitLoss11months[0]
                },
                {
                    ...baseTrade,
                    openTime: '2013-05-12T11:12:00Z',
                    closeTime: '2014-05-03T08:10:00Z',
                    profitLoss: profitLoss11months3weeks[0]
                },
                {
                    ...baseTrade,
                    openTime: '2013-05-12T11:12:00Z',
                    closeTime: '2014-04-11T08:10:00Z',
                    profitLoss: profitLoss11months3weeks4days[0]
                },
                {
                    ...baseTrade,
                    openTime: '2013-02-02T11:12:00Z',
                    closeTime: '2014-05-02T08:10:00Z',
                    profitLoss: profitLoss1year[0]
                },
                {
                    ...baseTrade,
                    openTime: '2010-02-03T11:12:00Z',
                    closeTime: '2011-05-05T08:10:00Z',
                    profitLoss: profitLoss1year[1]
                },
                {
                    ...baseTrade,
                    openTime: '2013-02-02T11:12:00Z',
                    closeTime: '2016-05-02T08:10:00Z',
                    profitLoss: profitLoss3years[0]
                },
                {
                    ...baseTrade,
                    openTime: '2011-02-02T11:12:00Z',
                    closeTime: '2014-05-02T08:10:00Z',
                    profitLoss: profitLoss3years[1]
                },
            ]
        }
        const result = tradeDurationTableCalc(accountData);
        const expectedResult: TradeDurationTableCalc = [
            {duration: '10 mins', noOfTrades: profitLoss10mins.length, result: _.sum(profitLoss10mins)},
            {duration: '34 mins', noOfTrades: profitLoss34mins.length, result: _.sum(profitLoss34mins)},
            {duration: '1 min', noOfTrades: profitLoss1min.length, result: _.sum(profitLoss1min)},
            {duration: '1 hour',
                noOfTrades: profitLoss59mins.length + profitLoss1hour.length + profitLoss51mins.length,
                result: _.sum(profitLoss59mins) + _.sum(profitLoss1hour) + _.sum(profitLoss51mins)},
            {duration: '9 hours', noOfTrades: profitLoss9hours.length, result: _.sum(profitLoss9hours)},
            {duration: '1 day', noOfTrades: profitLoss1day.length,
                result: _.sum(profitLoss1day)},
            {
                duration: '1 week',
                noOfTrades: profitLoss1week.length + profitLoss4days.length,
                result: _.sum(profitLoss1week) + _.sum(profitLoss4days)
            },
            {duration: '3 weeks', noOfTrades: profitLoss3weeks.length, result: _.sum(profitLoss3weeks)},
            {duration: '1 month', noOfTrades: profitLoss1month.length + profitLoss3weeks4days.length,
                result: _.sum(profitLoss1month) + _.sum(profitLoss3weeks4days)},
            {duration: '3 months', noOfTrades: profitLoss3months.length, result: _.sum(profitLoss3months)},
            {duration: '11 months', noOfTrades: profitLoss11months.length,
                result: _.sum(profitLoss11months)},
            {
                duration: '1 year',
                noOfTrades: profitLoss1year.length + profitLoss11months3weeks.length
                    + profitLoss11months3weeks4days.length,
                result: _.sum(profitLoss1year) + _.sum(profitLoss11months3weeks4days)
                    + _.sum(profitLoss11months3weeks)
                },
            {duration: '3 years', noOfTrades: profitLoss3years.length, result: _.sum(profitLoss3years)}
        ]
        test('it outputs the correct result', () => {
            expect(putInSameOrder(result, expectedResult, 'duration')).toEqual(expectedResult);
        })
    })
})