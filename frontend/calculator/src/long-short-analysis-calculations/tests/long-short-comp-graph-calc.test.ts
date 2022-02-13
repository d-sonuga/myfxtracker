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
    const tradeDateStr = '2022-10-20T18:34:00Z';
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
                openTime: tradeDateStr,
                closeTime: tradeDateStr,
                riskRewardRatio: 3,
                profitLoss: tradeProfitLoss,
                pips: 3,
                notes: '',
                entryImageLink: '',
                exitImageLink: '',
                lots: 3,
                commission: 2.3,
                swap: 3,
                stopLoss: 0,
                takeProfit: 0
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
                openTime: tradeDateStr,
                closeTime: tradeDateStr,
                riskRewardRatio: 3,
                profitLoss: tradeProfitLoss,
                pips: 3,
                notes: '',
                entryImageLink: '',
                exitImageLink: '',
                lots: 3,
                commission: 2.3,
                swap: 3,
                takeProfit: 0,
                stopLoss: 0
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