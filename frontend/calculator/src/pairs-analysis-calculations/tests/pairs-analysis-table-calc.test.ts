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
})