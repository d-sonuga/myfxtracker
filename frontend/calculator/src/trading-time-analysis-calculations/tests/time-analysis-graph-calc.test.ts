import timeAnalysisGraphCalc from '../time-analysis-graph-calc'
import {AccountData, TimeAnalysisGraphCalc, TimeAnalysisGraphCalcItem, Trade} from '@root/index'
import {randomInt, randomNumber, sameWeek} from '@root/utils'
import {getWeekDates} from '@root/overview-calculations/weekly-summary-calc'
import _ from 'lodash'
import {putInSameOrder as inOrder, randomTime} from './utils'

const baseTrade = (): Omit<Trade, 'openTime' | 'closeTime'> => {
    return {
        action: 'buy',
        takeProfit: 0,
        stopLoss: 0,
        riskRewardRatio: 0,
        pair: 'GBPUSD',
        profitLoss: randomNumber(-10000, 10000)
    }
}

const putInSameOrder = (result: TimeAnalysisGraphCalc, expectedResult: TimeAnalysisGraphCalc) => {
    type GraphItem = TimeAnalysisGraphCalcItem;
    return {
        todayGraphCalc: inOrder<GraphItem>(
            result.todayGraphCalc, expectedResult.todayGraphCalc, 'openHour'
        ),
        thisWeekGraphCalc: inOrder<GraphItem>(
            result.thisWeekGraphCalc, expectedResult.thisWeekGraphCalc, 'openHour'
        ),
        thisMonthGraphCalc: inOrder<GraphItem>(
            result.thisMonthGraphCalc, expectedResult.thisMonthGraphCalc, 'openHour'
        ),
        thisYearGraphCalc: inOrder<GraphItem>(
            result.thisYearGraphCalc, expectedResult.thisYearGraphCalc, 'openHour'
        ),
        allTimeGraphCalc: inOrder<GraphItem>(
            result.allTimeGraphCalc, expectedResult.allTimeGraphCalc, 'openHour'
        )
    }
}

const generateTrades = (today: Date, min: number = 2, max: number = 10000) => {
    const noOfTrades = randomInt(min, max);
    const noOfTradesToday = Math.round(noOfTrades / 5);
    const noOfTradesThisWeek = Math.round(noOfTrades / 5);
    const noOfTradesThisMonth = Math.round(noOfTrades / 5);
    const noOfTradesThisYear = Math.round(noOfTrades / 5);
    const noOfTradesAllTime = noOfTrades - (noOfTradesToday + 
        noOfTradesThisWeek + noOfTradesThisMonth + noOfTradesThisYear)
    const todayTrades: Trade[] = [];
    let thisWeekTrades: Trade[] = [];
    let thisMonthTrades: Trade[] = [];
    let thisYearTrades: Trade[] = [];
    let allTimeTrades: Trade[] = [];
    for(let i=0; i<noOfTradesToday; i++){
        const time = () => `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} ${randomTime()}`
        todayTrades.push({
            openTime: time(),
            closeTime: time(),
            ...baseTrade()
        })
    }
    thisWeekTrades = [...todayTrades];
    for(let i=0; i<noOfTradesThisWeek; i++){
        const getRandomDayInWeek = () => {
            const daysInWeek = getWeekDates(today);
            return daysInWeek[randomInt(0, daysInWeek.length - 1)];
        }
        const tradeTime = (): string => {
            const day = getRandomDayInWeek();
            if(day.getDate() >= today.getDate()){
                return tradeTime();
            }
            return `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()} ${randomTime()}`;
        };
        thisWeekTrades.push({
            openTime: tradeTime(),
            closeTime: tradeTime(),
            ...baseTrade()
        })
    }
    thisMonthTrades = [...thisWeekTrades];
    for(let i=0; i<noOfTradesThisMonth; i++){
        const getRandomDayInMonth = (): Date => {
            const date = randomInt(1, today.getDate());
            const day = new Date(today.getFullYear(), today.getMonth(), date);
            // Day shouldn't be Sunday or Saturday
            if(day.getDay() == 0 || day.getDay() == 6){
                return getRandomDayInMonth();
            }
            // Day should not be in the same week
            if(today.getDate() == day.getDate() || sameWeek(day, today)){
                return getRandomDayInMonth();
            }
            return day
        }
        const tradeTime = (() => {
            const day = getRandomDayInMonth();
            return `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()} ${randomTime()}`
        })();
        thisMonthTrades.push({
            openTime: tradeTime,
            closeTime: tradeTime,
            ...baseTrade()
        })
    }
    thisYearTrades = [...thisMonthTrades];
    for(let i=0; i<noOfTradesThisYear; i++){
        const getRandomDayInYear = (): Date => {
            const date = randomInt(1, 29);
            const month = randomInt(0, today.getMonth());
            const day = new Date(today.getFullYear(), month, date);
            // Day shouldn't be Sunday or Saturday
            if(day.getDay() == 0 || day.getDay() == 6){
                return getRandomDayInYear();
            }
            // Day shouldnt be in the same month with today
            if(day.getMonth() == today.getMonth()){
                return getRandomDayInYear();
            }
            return day
        }
        const tradeTime = (() => {
            const day = getRandomDayInYear();
            return `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()} ${randomTime()}`
        })();
        thisYearTrades.push({
            openTime: tradeTime,
            closeTime: tradeTime,
            ...baseTrade()
        })
    }
    allTimeTrades = [...thisYearTrades];
    for(let i=0; i<noOfTradesAllTime; i++){
        const getRandomDay = (): Date => {
            const date = randomInt(1, today.getDate());
            const month = randomInt(0, today.getMonth());
            const year = randomInt(1970, today.getFullYear());
            const day = new Date(year, month, date);
            // Day shouldn't be Sunday or Saturday
            if(day.getDay() == 0 || day.getDay() == 6){
                return getRandomDay();
            }
            if(today.getFullYear() == day.getFullYear()){
                return getRandomDay();
            }
            return day;
        }
        const tradeTime = (() => {
            const day = getRandomDay();
            return `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()} ${randomTime()}`
        })();
        allTimeTrades.push({
            openTime: tradeTime,
            closeTime: tradeTime,
            ...baseTrade()
        })
    }
    return [todayTrades, thisWeekTrades, thisMonthTrades, thisYearTrades, allTimeTrades];
}

const graphCalc = (trades: Trade[]) => {
    const tradeHourToResultMap: {[key: string]: number} = {};
    for(const trade of trades){
        // extract the '18' in '2022-10-3 18:30:00+00:00'
        const hour = trade.openTime.split(' ')[1].split(':')[0];
        if(!(hour in tradeHourToResultMap)){
            tradeHourToResultMap[hour] = 0;
        }
        tradeHourToResultMap[hour] += trade.profitLoss;
    }
    return Object.keys(tradeHourToResultMap).map((hour) => ({
        openHour: hour + ':00', result: tradeHourToResultMap[hour]
    }))
}

describe('Verify timeAnalysisGraphCalc is working', () => {
    describe('When accountData.trades is empty', () => {
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: []
        }
        const result = timeAnalysisGraphCalc(accountData);
        const expectedResult: TimeAnalysisGraphCalc = {
            todayGraphCalc: [],
            thisWeekGraphCalc: [],
            thisMonthGraphCalc: [],
            thisYearGraphCalc: [],
            allTimeGraphCalc: []
        }
        test('it outputs the default result', () => {
            expect(result).toEqual(expectedResult); 
        })
    })
    describe('When accountData.trades has 1 trade', () => {
        // Today is 8th February, 2022
        const today = new Date(2022, 1, 8);
        const hour18 = '18:34';
        const trades: Trade[] = [
            {
                openTime: `2022-02-01 ${hour18}:00+00:00`,
                closeTime: `2022-02-01 ${hour18}:00+00:00`,
                ...baseTrade()
            }
        ]
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades
        }
        const result = timeAnalysisGraphCalc(accountData, today);
        const expectedResult: TimeAnalysisGraphCalc = {
            todayGraphCalc: [],
            thisWeekGraphCalc: [],
            thisMonthGraphCalc: [{result: trades[0].profitLoss, openHour: '18:00'}],
            thisYearGraphCalc: [{result: trades[0].profitLoss, openHour: '18:00'}],
            allTimeGraphCalc: [{result: trades[0].profitLoss, openHour: '18:00'}],
        }
        test('it outputs the correct result', () => {
            expect(result).toEqual(expectedResult);
        })
    })
    describe('When accountData.trades has more than 1 trade', () => {
        // 8th February, 2022
        const today = new Date(2022, 1, 8);
        const todayProfitLoss = [300, -200];
        const thisWeekProfitLoss = [200, 12];
        const thisMonthProfitLoss = [34, 3900];
        const thisYearProfitLoss = [34, 43];
        const allTimeProfitLoss = [23, 45, 67, 888, -1000];
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: [
                {
                    ...baseTrade(),
                    openTime: '2022-02-08 12:03:00+00:00',
                    closeTime: '2022-02-08 12:03:00+00:00',
                    profitLoss: todayProfitLoss[0]
                },
                {
                    ...baseTrade(),
                    openTime: '2022-02-08 14:03:00+00:00',
                    closeTime: '2022-02-08 14:03:00+00:00',
                    profitLoss: todayProfitLoss[1]
                },
                {
                    ...baseTrade(),
                    openTime: '2022-02-07 14:33:00+00:00',
                    closeTime: '2022-02-07 14:33:00+00:00',
                    profitLoss: thisWeekProfitLoss[0]
                },
                {
                    ...baseTrade(),
                    openTime: '2022-02-07 16:27:00+00:00',
                    closeTime: '2022-02-07 16:27:00+00:00',
                    profitLoss: thisWeekProfitLoss[1]
                },
                {
                    ...baseTrade(),
                    openTime: '2022-02-01 14:33:00+00:00',
                    closeTime: '2022-02-01 14:33:00+00:00',
                    profitLoss: thisMonthProfitLoss[0]
                },
                {
                    ...baseTrade(),
                    openTime: '2022-02-01 16:27:00+00:00',
                    closeTime: '2022-02-01 16:27:00+00:00',
                    profitLoss: thisMonthProfitLoss[1]
                },
                {
                    ...baseTrade(),
                    openTime: '2022-01-07 08:33:00+00:00',
                    closeTime: '2022-01-07 08:33:00+00:00',
                    profitLoss: thisYearProfitLoss[0]
                },
                {
                    ...baseTrade(),
                    openTime: '2022-01-07 10:27:00+00:00',
                    closeTime: '2022-01-07 10:27:00+00:00',
                    profitLoss: thisYearProfitLoss[1]
                },
                {
                    ...baseTrade(),
                    openTime: '2021-02-07 17:33:00+00:00',
                    closeTime: '2021-02-07 17:33:00+00:00',
                    profitLoss: allTimeProfitLoss[0]
                },
                {
                    ...baseTrade(),
                    openTime: '2020-02-07 16:27:00+00:00',
                    closeTime: '2020-02-07 16:27:00+00:00',
                    profitLoss: allTimeProfitLoss[1]
                },
                {
                    ...baseTrade(),
                    openTime: '2019-02-07 13:33:00+00:00',
                    closeTime: '2019-02-07 13:33:00+00:00',
                    profitLoss: allTimeProfitLoss[2]
                },
                {
                    ...baseTrade(),
                    openTime: '2010-02-07 11:27:00+00:00',
                    closeTime: '2010-02-07 11:27:00+00:00',
                    profitLoss: allTimeProfitLoss[3]
                },
                {
                    ...baseTrade(),
                    openTime: '2011-02-07 11:33:00+00:00',
                    closeTime: '2011-02-07 11:33:00+00:00',
                    profitLoss: allTimeProfitLoss[4]
                }
            ]
        }
        let result = timeAnalysisGraphCalc(accountData, today);
        const expectedResult: TimeAnalysisGraphCalc = {
            todayGraphCalc: [
                {openHour: '12:00', result: todayProfitLoss[0]},
                {openHour: '14:00', result: todayProfitLoss[1]}
            ],
            thisWeekGraphCalc: [
                {openHour: '12:00', result: todayProfitLoss[0]},
                {openHour: '14:00', result: todayProfitLoss[1] + thisWeekProfitLoss[0]},
                {openHour: '16:00', result: thisWeekProfitLoss[1]}
            ],
            thisMonthGraphCalc: [
                {openHour: '12:00', result: todayProfitLoss[0]},
                {openHour: '14:00', result: todayProfitLoss[1] + thisWeekProfitLoss[0] + thisMonthProfitLoss[0]},
                {openHour: '16:00', result: thisWeekProfitLoss[1] + thisMonthProfitLoss[1]}
            ],
            thisYearGraphCalc: [
                {openHour: '08:00', result: thisYearProfitLoss[0]},
                {openHour: '10:00', result: thisYearProfitLoss[1]},
                {openHour: '12:00', result: todayProfitLoss[0]},
                {openHour: '14:00', result: todayProfitLoss[1] + thisWeekProfitLoss[0] + thisMonthProfitLoss[0]},
                {openHour: '16:00', result: thisWeekProfitLoss[1] + thisMonthProfitLoss[1]},
            ],
            allTimeGraphCalc: [
                {openHour: '08:00', result: thisYearProfitLoss[0]},
                {openHour: '10:00', result: thisYearProfitLoss[1]},
                {openHour: '11:00', result: allTimeProfitLoss[3] + allTimeProfitLoss[4]},
                {openHour: '12:00', result: todayProfitLoss[0]},
                {openHour: '13:00', result: allTimeProfitLoss[2]},
                {openHour: '14:00', result: todayProfitLoss[1] + thisWeekProfitLoss[0] + thisMonthProfitLoss[0]},
                {openHour: '16:00', result: thisWeekProfitLoss[1] + thisMonthProfitLoss[1] + allTimeProfitLoss[1]},
                {openHour: '17:00', result: allTimeProfitLoss[0]},
            ]
        }
        test('it outputs the correct result', () => {
            expect(putInSameOrder(result, expectedResult)).toEqual(expectedResult);
        })
    })
    describe('When accountData.trades has more than 1 trade, all random', () => {
        // 8th February, 2022
        const today = new Date(2022, 1, 8);
        const [
            todayTrades, thisWeekTrades, thisMonthTrades, thisYearTrades, allTimeTrades
        ]: Trade[][] = generateTrades(today);
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: [...allTimeTrades]
        }
        const result = timeAnalysisGraphCalc(accountData, today);
        const expectedResult: TimeAnalysisGraphCalc = {
            todayGraphCalc: graphCalc(todayTrades),
            thisWeekGraphCalc: graphCalc(thisWeekTrades),
            thisMonthGraphCalc: graphCalc(thisMonthTrades),
            thisYearGraphCalc: graphCalc(thisYearTrades),
            allTimeGraphCalc: graphCalc(allTimeTrades)
        }
        test('it outputs the correct result', () => {
            expect(putInSameOrder(result, expectedResult)).toEqual(expectedResult);
        })
    })
    describe('When accountData.trades has more than 10000 trades, all random', () => {
        // 8th February, 2022
        const today = new Date(2022, 1, 8);
        const [
            todayTrades, thisWeekTrades, thisMonthTrades, thisYearTrades, allTimeTrades
        ]: Trade[][] = generateTrades(today, 10001, 20000);
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: [...allTimeTrades]
        }
        let result = timeAnalysisGraphCalc(accountData, today);
        const expectedResult: TimeAnalysisGraphCalc = {
            todayGraphCalc: graphCalc(todayTrades),
            thisWeekGraphCalc: graphCalc(thisWeekTrades),
            thisMonthGraphCalc: graphCalc(thisMonthTrades),
            thisYearGraphCalc: graphCalc(thisYearTrades),
            allTimeGraphCalc: graphCalc(allTimeTrades)
        }
        test('it outputs the correct result', () => {
            expect(putInSameOrder(result, expectedResult)).toEqual(expectedResult);
        })
    })
})