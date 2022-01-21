import expensesTableCalc from '../expenses-table-calc'
import {ExpensesTableCalc} from '../types'

/** @Note These tests are far from complete */

describe('Verify that expensesTableCalc is working', () => {
    describe('When accountData.trades is empty', () => {
        const accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: []
        }
        const result = expensesTableCalc(accountData);
        const expectedResult: ExpensesTableCalc = []
        test('it outputs an empty array', () => {
            expect(result).toEqual(expectedResult);
        })
    })
})