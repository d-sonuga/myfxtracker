import { AccountData } from '@root/types'
import pairsAnalysisTableCalc from '../pairs-analysis-table-calc'
import {PairsAnalysisTableCalc} from '../types'

/** @Note these tests are far from complete */

describe('Verify that pairsAnalysisTableCalc is working', () => {
    describe('When there are no trades in accountData.trades', () => {
        const accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: []
        }
        const result = pairsAnalysisTableCalc(accountData);
        const expectedResult: PairsAnalysisTableCalc = [];
        test('it outputs an empty array', () => {
            expect(result).toEqual(expectedResult);
        })
    })
    describe('When there are 3 trades', () => {
        const pair1 = 'EURUSD';
        const pair2 = 'EURNOK';
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: [
                {
                    pair: pair1,
                    action: 'buy',
                    takeProfit: 20,
                    stopLoss: 15,
                    profitLoss: 200,
                    openTime: '2022-12-02 13:04:00+00:00',
                    closeTime: '2022-12-02 13:04:00+00:00',
                    commission: 20,
                    swap: 12
                },
                {
                    pair: pair1,
                    action: 'sell',
                    takeProfit: 10,
                    stopLoss: 5,
                    profitLoss: -500,
                    openTime: '2022-12-02 13:04:00+00:00',
                    closeTime: '2022-12-02 13:04:00+00:00',
                    commission: 10,
                    swap: 2
                },
                {
                    pair: pair2,
                    action: 'sell',
                    takeProfit: 10,
                    stopLoss: 5,
                    profitLoss: -500,
                    openTime: '2022-12-02 13:04:00+00:00',
                    closeTime: '2022-12-02 13:04:00+00:00',
                    commission: 10,
                    swap: 2
                }
            ]
        }
        const result = pairsAnalysisTableCalc(accountData);
        const expectedResult: PairsAnalysisTableCalc = [
            {
                pair: pair1,
                noOfTradesOnPair: 2,
                noOfProfitableTradesOnPair: 1,
                noOfSlOnPair: 20,
                noOfLongsOnPair: 1,
                noOfShortsOnPair: 1,
                noOfLosingTradesOnPair: 1,
                noOfTpOnPair: 30,
                longsOnPairPercent: 50,
                shortsOnPairPercent: 50,
                losingTradesOnPairPercent: 50,
                tpOnPairPercent: 15,
                slOnPairPercent: 10,
                profitableTradesOnPairPercent: 50
            },
            {
                pair: pair2,
                noOfTradesOnPair: 1,
                noOfProfitableTradesOnPair: 0,
                noOfSlOnPair: 5,
                noOfLongsOnPair: 0,
                noOfShortsOnPair: 1,
                noOfLosingTradesOnPair: 1,
                noOfTpOnPair: 10,
                longsOnPairPercent: 0,
                shortsOnPairPercent: 100,
                losingTradesOnPairPercent: 100,
                tpOnPairPercent: 10,
                slOnPairPercent: 5,
                profitableTradesOnPairPercent: 0
            },
        ]
        test('it outputs the correct result', () => {
            expect(result).toEqual(expectedResult);
        })
    })
})