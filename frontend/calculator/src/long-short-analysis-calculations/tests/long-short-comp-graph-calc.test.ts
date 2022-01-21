import {Deposit, Withdrawal, Trade, AccountData} from '@root/types'
import longShortComparisonGraphCalc from '../long-short-comp-graph-calc'
import {LongShortComparisonGraphCalc} from '../types'


/**
 * @TODO add proper tests (these things in this file are not tests)
 */

 describe('Verify that longShortComparisonGraphCalc is working', () => {
    /**
     * date of trade, Deposits and withdrawals aren't needed for these tests
     * because they aren't used in any of the calculations
     */
    const deposits: Deposit[] = [];
    const withdrawals: Withdrawal[] = [];
    const tradeDateStr = '2022-10-20';
    describe('When there are no trades in accountData', () => {
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: deposits,
            withdrawals: withdrawals,
            trades: []
        }
        const result = longShortComparisonGraphCalc(accountData);
        const expectedResult: LongShortComparisonGraphCalc = [
            {label: 'long', result: 0},
            {label: 'short', result: 0}
        ]
        test('long and short results are the default results', () => {
            expect(result).toEqual(expectedResult);
        })
    })
    describe('When there is only 1 long (action = buy) trade in accountData', () => {
        const tradeProfitLoss = 300;
        const trades: Trade[] = [
            {
                pair: 'GBPJPY',
                action: 'buy',
                entry_date: tradeDateStr,
                exit_date: tradeDateStr,
                risk_reward_ratio: 3,
                profit_loss: tradeProfitLoss,
                pips: 3,
                notes: '',
                entry_image_link: '',
                exit_image_link: '',
                date_added: tradeDateStr,
                lots: 3,
                commissions: 2.3,
                swap: 3
            }
        ];
        const accountData: AccountData = {
            name: 'dummy account',
            deposits,
            withdrawals,
            trades
        }
        const result = longShortComparisonGraphCalc(accountData);
        const expectedResult: LongShortComparisonGraphCalc = [
            {label: 'long', result: tradeProfitLoss},
            {label: 'short', result: 0}
        ]
        test('it outputs results with the correct data', () => {
            expect(result).toEqual(expectedResult);
        })
    })
    describe('When there is only 1 short (action = sell) trade in accountData', () => {
        const tradeProfitLoss = 300;
        const trades: Trade[] = [
            {
                pair: 'GBPJPY',
                action: 'sell',
                entry_date: tradeDateStr,
                exit_date: tradeDateStr,
                risk_reward_ratio: 3,
                profit_loss: tradeProfitLoss,
                pips: 3,
                notes: '',
                entry_image_link: '',
                exit_image_link: '',
                date_added: tradeDateStr,
                lots: 3,
                commissions: 2.3,
                swap: 3
            }
        ];
        const accountData: AccountData = {
            name: 'dummy account',
            deposits,
            withdrawals,
            trades
        }
        const result = longShortComparisonGraphCalc(accountData);
        const expectedResult: LongShortComparisonGraphCalc = [
            {label: 'long', result: 0},
            {label: 'short', result: tradeProfitLoss}
        ]
        test('it outputs results with the correct data', () => {
            expect(result).toEqual(expectedResult);
        })
    })
})