import {CashGraphCalc} from '@root/index'
import {AccountData, Deposit, Withdrawal, Trade} from '@root/types'
import {mergeArrays, randomNumber, sumObjArray} from '@root/utils'
import cashGraphCalc from '../cash-graph-calc'
import {CashGraphItem} from '../types'

/**
 * @Note These tests are far from complete
 */

describe('Verify cashGraphCalc works', () => {
    /** To create a new trade object without having to specify all trade attributes */
    const newTrade = (attr: any) => {
        return {
            profit_loss: randomNumber(-1000000, 1000000),
            entry_date: attr.date !== undefined ? attr.date : '2021-10-18',
            exit_date: attr.date !== undefined ? attr.date : '2021-10-18',
            pair: 'GBPUSD',
            action: 'buy',
            risk_reward_ratio: 2,
            date_added: attr.date !== undefined ? attr.date : '2021-10-18'
        }
    }
    const defaultCashGraphItem: CashGraphItem[] = [{tradeNo: 0, balance: 0}];
    describe('When there are no trades, deposits or withdrawals in accountData', () => {
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: []
        }
        const result = cashGraphCalc(accountData);
        const defaultCashGraphItem: CashGraphItem[] = [{tradeNo: 0, balance: 0}];
        const expectedResult: CashGraphCalc = {
            todayGraphCalc: defaultCashGraphItem,
            thisWeekGraphCalc: defaultCashGraphItem,
            thisMonthGraphCalc: defaultCashGraphItem,
            thisYearGraphCalc: defaultCashGraphItem,
            allTimeGraphCalc: defaultCashGraphItem
        }
        test('it outputs the default output', () => {
            expect(result).toEqual(expectedResult);
        })
    })
    describe('When there are only withdrawals, but no trades', () => {
        const withdrawals: Withdrawal[] = [1, 2, 3, 4, 5].map((i) => (
            {account: 3, amount: 500, date: '2022-12-02'}
        ))
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: withdrawals,
            trades: []
        }
        const result = cashGraphCalc(accountData);
        const defaultCashGraphItem: CashGraphItem[] = [{tradeNo: 0, balance: 0}];
        const expectedResult: CashGraphCalc = {
            todayGraphCalc: defaultCashGraphItem,
            thisWeekGraphCalc: defaultCashGraphItem,
            thisMonthGraphCalc: defaultCashGraphItem,
            thisYearGraphCalc: defaultCashGraphItem,
            allTimeGraphCalc: defaultCashGraphItem
        }
        test('it outputs the default output', () => {
            expect(result).toEqual(expectedResult);
        })
    })
    describe('When there are only deposits, but no trades', () => {
        const deposits: Deposit[] = [1, 2, 3, 4, 5].map((i) => (
            {account: 3, amount: 500, date: '2022-12-02'}
        ))
        const accountData: AccountData = {
            name: 'dummy account',
            deposits,
            withdrawals: [],
            trades: []
        }
        const result = cashGraphCalc(accountData);
        const defaultCashGraphItem: CashGraphItem[] = [{tradeNo: 0, balance: 0}];
        const expectedResult: CashGraphCalc = {
            todayGraphCalc: defaultCashGraphItem,
            thisWeekGraphCalc: defaultCashGraphItem,
            thisMonthGraphCalc: defaultCashGraphItem,
            thisYearGraphCalc: defaultCashGraphItem,
            allTimeGraphCalc: defaultCashGraphItem
        }
        test('it outputs the default output', () => {
            expect(result).toEqual(expectedResult);
        })
    })
    describe('When there are only trades', () => {
        const cummulativeAdditions = (trades: Trade[]) => {
            let cummulativeAddition = 0;
            const result: CashGraphItem[] = [];
            for(const i in trades){
                const trade = trades[i];
                cummulativeAddition += trade.profit_loss;
                result.push({tradeNo: parseInt(i) + 1, balance: cummulativeAddition});
            }
            return result
        }
        /** 30th October, 2021 */
        const today = new Date(2021, 9, 30)
        /**
         * 12th, 14th, 18th, 25th, 29th October 2021
         * 12th and 14th are in the same week
         * 18th is the only one in its week
         * 25th and 29th are in the same week, with 30th which is today
         * */
        const todayTrades: Trade[] = [];
        const thisWeekTrades: Trade[] = [
            {
                profit_loss: randomNumber(-1000000, 1000000), entry_date: '2021-10-25',
                exit_date: '2021-10-25', pair: 'GBPUSD', action: 'buy', risk_reward_ratio: 2,
                date_added: '2021-10-25'
            },
            {
                profit_loss: randomNumber(-1000000, 1000000), entry_date: '2021-10-29',
                exit_date: '2021-10-29', pair: 'GBPUSD', action: 'buy', risk_reward_ratio: 2,
                date_added: '2021-10-29'
            }
        ]
        const thisMonthTrades: Trade[] = [
            ...thisWeekTrades,
            {
                profit_loss: randomNumber(-1000000, 1000000), entry_date: '2021-10-18',
                exit_date: '2021-10-18', pair: 'GBPUSD', action: 'buy', risk_reward_ratio: 2,
                date_added: '2021-10-18'
            }
        ]
        const thisYearTrades: Trade[] = [
            ...thisMonthTrades,
            {
                profit_loss: randomNumber(-1000000, 1000000), entry_date: '2021-9-14',
                exit_date: '2021-9-14', pair: 'GBPUSD', action: 'buy', risk_reward_ratio: 2,
                date_added: '2021-9-14'
            }
        ]
        const allTimeTrades: Trade[] = [
            ...thisYearTrades,
            {
                profit_loss: randomNumber(-1000000, 1000000), entry_date: '2020-9-12',
                exit_date: '2020-9-12', pair: 'GBPUSD', action: 'buy', risk_reward_ratio: 2,
                date_added: '2020-9-12'
            }
        ]
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: allTimeTrades
        }
        const result = cashGraphCalc(accountData, today);
        const expectedResult: CashGraphCalc = {
            todayGraphCalc: [
                ...defaultCashGraphItem
            ],
            thisWeekGraphCalc: [
                ...defaultCashGraphItem,
                ...cummulativeAdditions(thisWeekTrades)
            ],
            thisMonthGraphCalc: [
                ...defaultCashGraphItem,
                ...cummulativeAdditions(thisMonthTrades)
            ],
            thisYearGraphCalc: [
                ...defaultCashGraphItem,
                ...cummulativeAdditions(thisYearTrades)
            ],
            allTimeGraphCalc: [
                ...defaultCashGraphItem,
                ...cummulativeAdditions(allTimeTrades)                
            ]
        }
        test('it outputs the correct result', () => {
            expect(result).toEqual(expectedResult);
        })
    })
    describe('When there are deposits and trades', () => {
        const today = new Date(2021, 1, 18);
        /**
         * To make the required additions easier, the deposits and trades are arranged
         * in such a way that all deposits that took place before a set of trades will
         * be in an array that has the same tag as the trades array.
         * For example,
         * depositsA are all deposits that took place before all the trades in tradesA
         */
        const depositsA: Deposit[] = [
            {account: 2, amount: 200, date: '2021-02-15'}
        ]
        const tradesA: Trade[] = [
            newTrade({date: '2021-02-17'})
        ]
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: [...depositsA],
            withdrawals: [],
            trades: [...tradesA]
        }
        const result = cashGraphCalc(accountData, today);
        const expectedResult: CashGraphCalc = {
            todayGraphCalc: [
                ...defaultCashGraphItem
            ],
            thisWeekGraphCalc: [
                ...defaultCashGraphItem,
                {tradeNo: 1, balance: sumObjArray(tradesA, 'profit_loss') + sumObjArray(depositsA, 'amount')}
            ],
            thisMonthGraphCalc: [
                ...defaultCashGraphItem,
                {tradeNo: 1, balance: sumObjArray(tradesA, 'profit_loss') + sumObjArray(depositsA, 'amount')}
            ],
            thisYearGraphCalc: [
                ...defaultCashGraphItem,
                {tradeNo: 1, balance: sumObjArray(tradesA, 'profit_loss') + sumObjArray(depositsA, 'amount')}
            ],
            allTimeGraphCalc: [
                ...defaultCashGraphItem,
                {tradeNo: 1, balance: sumObjArray(tradesA, 'profit_loss') + sumObjArray(depositsA, 'amount')}
            ]
        }
        test('it outputs the expected result', () => {
            expect(result).toEqual(expectedResult);
        })
    })
})