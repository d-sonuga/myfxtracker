import {OverviewStatsCalc} from '@root/index'
import {AccountData} from '@root/types'
import statsCalc from '../overview-stats-calc'

/**
 * @Note these tests are far from done
 */

describe('Verify that statsCalc is working', () => {
    describe('When there are no deposits, withdrawals or trades', () => {
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: []
        }
        const result = statsCalc(accountData);
        const expectedResult: OverviewStatsCalc = {
            aveProfit: 0,
            aveLoss: 0,
            longsWonPercent: 0,
            noOfLongsWon: 0,
            shortsWonPercent: 0,
            noOfShortsWon: 0,
            noOfLongs: 0,
            noOfShorts: 0,
            bestTrade: 0,
            worstTrade: 0,
            highestBalance: 0,
            aveRRR: 0,
            profitFactor: 0,
            expectancy: 0,
            lots: 0,
            commissions: 0
        }
        test('It outputs the default result', () => {
            expect(result).toEqual(expectedResult);
        })
    })
    describe('When there are 2 trades', () => {
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: [
                {
                    pair: 'USDNOK',
                    profitLoss: 500,
                    takeProfit: 0,
                    stopLoss: 0,
                    commission: 20,
                    swap: 10,
                    riskRewardRatio: 3,
                    action: 'buy',
                    openTime: '2022-10-23T12:09:00Z',
                    closeTime: '2022-10-23T12:09:00Z',
                    openPrice: 0,
                    closePrice: 0
                },
                {
                    pair: 'USDNOK',
                    profitLoss: -100,
                    takeProfit: 0,
                    stopLoss: 0,
                    commission: 20,
                    swap: 10,
                    riskRewardRatio: 3,
                    action: 'sell',
                    openTime: '2022-10-23T12:09:00Z',
                    closeTime: '2022-10-23T12:09:00Z',
                    openPrice: 0,
                    closePrice: 0
                }
            ]
        }
        const result = statsCalc(accountData);
        const expectedResult: OverviewStatsCalc = {
            aveProfit: 500,
            aveLoss: 100,
            longsWonPercent: 100,
            shortsWonPercent: 0,
            noOfLongs: 1,
            noOfLongsWon: 1,
            noOfShorts: 1,
            noOfShortsWon: 0,
            aveRRR: 5,
            bestTrade: 500,
            worstTrade: -100,
            profitFactor: -5,
            highestBalance: 500,
            expectancy: 20000,
            lots: 0,
            commissions: 60
        }
        test('it should output the correct result', () => {
            expect(result).toEqual(expectedResult);
        })
    })
})