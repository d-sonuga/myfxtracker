import {AveReturnsPerPairGraphCalc, AveRrrPerPairGraphCalc } from '@root/index'
import {aveRRR} from '@root/overview-calculations'
import {AccountData} from '@root/types'
import aveRrrPerPairGraphCalc from '../ave-rrr-per-pair-graph-calc'


describe('Verify that aveRrrPerPairGraphCalc is working', () => {
    describe('When there are no trades', () => {
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: []
        }
        const result = aveRrrPerPairGraphCalc(accountData);
        const expectedResult: AveReturnsPerPairGraphCalc = [];
        test('it outputs an empty array', () => {
            expect(result).toEqual(expectedResult);
        })
    })
    describe('When there is 1 trade', () => {
        const pair = 'GBPUSD';
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: [
                {
                    pair,
                    action: 'buy',
                    commission: 20,
                    takeProfit: 20,
                    stopLoss: 32,
                    swap: 20,
                    profitLoss: 200,
                    openTime: '2022-09-04T13:02:00Z',
                    closeTime: '2022-09-04T13:02:00Z'
                }
            ]
        }
        const result = aveRrrPerPairGraphCalc(accountData);
        const expectedResult: AveRrrPerPairGraphCalc = [
            {pair, rrr: aveRRR(accountData)}
        ]
        test('it outputs the correct result', () => {
            expect(result).toEqual(expectedResult);
        })
    })
})