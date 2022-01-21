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
})