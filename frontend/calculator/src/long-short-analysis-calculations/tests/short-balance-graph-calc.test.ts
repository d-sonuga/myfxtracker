import {AccountData, Deposit, Withdrawal, Trade} from '@root/types'
import shortBalanceGraphCalc from '../short-balance-graph-calc'
import {ShortBalanceGraphCalc} from '../types'

/**
 * @TODO add proper tests (these things in this file are not tests)
 */

describe('Verify that shortBalanceGraphCalc is working', () => {
    /**
     * date of trade, Deposits and withdrawals aren't needed for these tests
     * because they aren't used in any of the calculations
     */
    const deposits: Deposit[] = [];
    const withdrawals: Withdrawal[] = [];
    const tradeDateStr = '2022-10-20 18:34:00+00:00';
    describe('When there are no trades in accountData', () => {
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: deposits,
            withdrawals: withdrawals,
            trades: []
        }
        const result = shortBalanceGraphCalc(accountData);
        const expectedResult: ShortBalanceGraphCalc = [
            {tradeNo: 0, result: 0}
        ]
        test('results are the default results', () => {
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
        const result = shortBalanceGraphCalc(accountData);
        const expectedResult: ShortBalanceGraphCalc = [
            {tradeNo: 0, result: 0}
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
        const result = shortBalanceGraphCalc(accountData);
        const expectedResult: ShortBalanceGraphCalc = [
            {tradeNo: 0, result: 0},
            {tradeNo: 1, result: tradeProfitLoss}
        ]
        test('it outputs results with the correct data', () => {
            expect(result).toEqual(expectedResult);
        })
    })
})