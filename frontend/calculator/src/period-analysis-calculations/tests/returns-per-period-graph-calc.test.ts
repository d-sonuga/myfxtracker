import {ReturnsPerPeriodGraphCalc} from '@root/index'
import {AccountData} from '@root/types'
import returnsPerPeriodGraphCalc from '../returns-per-period-graph-calc'


describe('Verify returnsPerPeriodGraphCalc is working', () => {
    describe('When accountData.trades is empty', () => {
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: []
        }
        const result = returnsPerPeriodGraphCalc(accountData);
        const expectedResult: ReturnsPerPeriodGraphCalc = {
            daily: [
                {day: 'Monday', result: 0},
                {day: 'Tuesday', result: 0},
                {day: 'Wednesday', result: 0},
                {day: 'Thursday', result: 0},
                {day: 'Friday', result: 0}
            ],
            monthly: [
                {month: 'January', result: 0},
                {month: 'February', result: 0},
                {month: 'March', result: 0},
                {month: 'April', result: 0},
                {month: 'May', result: 0},
                {month: 'June', result: 0},
                {month: 'July', result: 0},
                {month: 'August', result: 0},
                {month: 'September', result: 0},
                {month: 'October', result: 0},
                {month: 'November', result: 0},
                {month: 'December', result: 0},
            ],
            yearly: []
        }
        test('It outputs the default result', () => {
            expect(result).toEqual(expectedResult);
        })
    })
    
})