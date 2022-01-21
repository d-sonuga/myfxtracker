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
})
