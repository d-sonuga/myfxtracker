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
    const newTrade = (attr: any): Trade => {
        return {
            profitLoss: randomNumber(-1000000, 1000000),
            openTime: attr.time !== undefined ? attr.time : '2021-10-18',
            closeTime: attr.time !== undefined ? attr.time : '2021-10-18',
            pair: 'GBPUSD',
            action: 'buy',
            riskRewardRatio: 2,
            takeProfit: 0,
            stopLoss: 0
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
            {account: 3, amount: 500, time: '2022-12-02 18:34:00+00:00'}
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
            {account: 3, amount: 500, time: '2022-12-02'}
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
                cummulativeAddition += trade.profitLoss;
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
                profitLoss: randomNumber(-1000000, 1000000), openTime: '2021-10-25 18:34:00+00:00',
                closeTime: '2021-10-25', pair: 'GBPUSD', action: 'buy', riskRewardRatio: 2,
                stopLoss: 0, takeProfit: 0
            },
            {
                profitLoss: randomNumber(-1000000, 1000000), openTime: '2021-10-29 18:34:00+00:00',
                closeTime: '2021-10-29', pair: 'GBPUSD', action: 'buy', riskRewardRatio: 2,
                takeProfit: 0, stopLoss: 0
            }
        ]
        const thisMonthTrades: Trade[] = [
            ...thisWeekTrades,
            {
                profitLoss: randomNumber(-1000000, 1000000), openTime: '2021-10-18',
                closeTime: '2021-10-18', pair: 'GBPUSD', action: 'buy', riskRewardRatio: 2,
                stopLoss: 0, takeProfit: 0
            }
        ]
        const thisYearTrades: Trade[] = [
            ...thisMonthTrades,
            {
                profitLoss: randomNumber(-1000000, 1000000), openTime: '2021-9-14',
                closeTime: '2021-9-14', pair: 'GBPUSD', action: 'buy', riskRewardRatio: 2,
                stopLoss: 0, takeProfit: 0
            }
        ]
        const allTimeTrades: Trade[] = [
            ...thisYearTrades,
            {
                profitLoss: randomNumber(-1000000, 1000000), openTime: '2020-9-12',
                closeTime: '2020-9-12', pair: 'GBPUSD', action: 'buy', riskRewardRatio: 2,
                stopLoss: 0, takeProfit: 0
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
            {account: 2, amount: 200, time: '2021-02-15 18:34:00+00:00'}
        ]
        const tradesA: Trade[] = [
            newTrade({time: '2021-02-17 18:34:00+00:00'})
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
                {tradeNo: 1, balance: sumObjArray(tradesA, 'profitLoss') + sumObjArray(depositsA, 'amount')}
            ],
            thisMonthGraphCalc: [
                ...defaultCashGraphItem,
                {tradeNo: 1, balance: sumObjArray(tradesA, 'profitLoss') + sumObjArray(depositsA, 'amount')}
            ],
            thisYearGraphCalc: [
                ...defaultCashGraphItem,
                {tradeNo: 1, balance: sumObjArray(tradesA, 'profitLoss') + sumObjArray(depositsA, 'amount')}
            ],
            allTimeGraphCalc: [
                ...defaultCashGraphItem,
                {tradeNo: 1, balance: sumObjArray(tradesA, 'profitLoss') + sumObjArray(depositsA, 'amount')}
            ]
        }
        test('it outputs the expected result', () => {
            expect(result).toEqual(expectedResult);
        })
    })
})