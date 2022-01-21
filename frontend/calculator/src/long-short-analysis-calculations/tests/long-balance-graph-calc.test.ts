    import {AccountData, Deposit, Withdrawal, Trade} from '@root/types'
    import longBalanceGraphCalc from '../long-balance-graph-calc'
    import {LongBalanceGraphCalc} from '../types'

    /**
     * @TODO add proper tests (these things in this file are not tests)
     */

    describe('Verify that longBalanceGraphCalc is working', () => {
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
            const result = longBalanceGraphCalc(accountData);
            const expectedResult: LongBalanceGraphCalc = [
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
            const result = longBalanceGraphCalc(accountData);
            const expectedResult: LongBalanceGraphCalc = [
                {tradeNo: 0, result: 0},
                {tradeNo: 1, result: tradeProfitLoss}
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
            const result = longBalanceGraphCalc(accountData);
            const expectedResult: LongBalanceGraphCalc = [
                {tradeNo: 0, result: 0}
            ]
            test('it outputs results with the correct data', () => {
                expect(result).toEqual(expectedResult);
            })
        })
    })