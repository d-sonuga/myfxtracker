import {AccountData} from '@root/types'
import aveReturnsPerPairGraphCalc from '../ave-returns-per-pair-graph-calc'
import {AveReturnsPerPairGraphCalc} from '../types'

/**
 * @Note -> these tests are far from done
 */

describe('Verify aveReturnsPerPairGraphCalc is working', () => {
    describe('When accountData.trades is empty', () => {
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: []
        }
        const result = aveReturnsPerPairGraphCalc(accountData);
        const expectedResult: AveReturnsPerPairGraphCalc = [];
        test('it outputs an empty array', () => {
            expect(result).toEqual(expectedResult);
        })
    })
    describe('When there is 1 trade', () => {
        const pair = 'GBPUSD';
        const profitLoss = 200;
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: [
                {
                    pair,
                    profitLoss,
                    takeProfit: 0,
                    stopLoss: 0,
                    commission: 20,
                    swap: 12,
                    action: 'buy',
                    openTime: '2022-03-23T14:03:00Z',
                    closeTime: '2022-03-23T14:03:00Z'
                }
            ]
        }
        const result = aveReturnsPerPairGraphCalc(accountData);
        const expectedResult: AveReturnsPerPairGraphCalc = [
            {pair, result: profitLoss}
        ];
        test('it outputs the correct result', () => {
            expect(result).toEqual(expectedResult);
        })
    })
})