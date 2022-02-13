import {GainsGraphCalc} from '@root/index'
import {AccountData, Deposit, Trade, Withdrawal} from '@root/types'
import {randomNumber, sumObjArray} from '@root/utils'
import gainsGraphCalc from '../gains-graph-calc'
import {GainsGraphItem} from '../types'


describe('Verify gainsGraphCalc is working', () => {
    /** To create a new trade object without having to specify all trade attributes */
    const newTrade = (attr: any) => {
        return {
            profitLoss: randomNumber(-1000000, 1000000),
            openTime: attr.date !== undefined ? attr.date : '2021-10-18T18:34:00Z',
            closeTime: attr.date !== undefined ? attr.date : '2021-10-18T18:34:00Z',
            pair: 'GBPUSD',
            action: 'buy',
            riskRewardRatio: 2,
            stopLoss: 0,
            takeProfit: 0
        }
    }
    describe('When there are no trades or deposits', () => {
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: []
        }
        const result = gainsGraphCalc(accountData);
        const defaultGraphItems: GainsGraphItem[] = [{tradeNo: 0, gainsPercent: 0}]
        const expectedResult: GainsGraphCalc = {
            todayGraphCalc: defaultGraphItems,
            thisWeekGraphCalc: defaultGraphItems,
            thisMonthGraphCalc: defaultGraphItems,
            thisYearGraphCalc: defaultGraphItems,
            allTimeGraphCalc: defaultGraphItems
        }
        test('it outputs the default output', () => {
            expect(result).toEqual(expectedResult);
        })
    })
    describe('When there are only withdrawals', () => {
        const withdrawals: Withdrawal[] = ((numberOfWithdrawals) => {
            const withdrawals: Withdrawal[] = [];
            for(let i=numberOfWithdrawals; i>0; i--){
                withdrawals.push(
                    {
                        account: 2,
                        amount: randomNumber(-1000000, 1000000),
                        time: '2021-10-12T18:34:00Z'
                    }
                )
            }
            return withdrawals
        })(20)
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals,
            trades: []
        }
        const result = gainsGraphCalc(accountData);
        const defaultGraphItems: GainsGraphItem[] = [{tradeNo: 0, gainsPercent: 0}]
        const expectedResult: GainsGraphCalc = {
            todayGraphCalc: defaultGraphItems,
            thisWeekGraphCalc: defaultGraphItems,
            thisMonthGraphCalc: defaultGraphItems,
            thisYearGraphCalc: defaultGraphItems,
            allTimeGraphCalc: defaultGraphItems
        }
        test('it outputs the default output', () => {
            expect(result).toEqual(expectedResult);
        })
    })
    describe('When there are only deposits', () => {
        const deposits: Deposit[] = ((numberOfWithdrawals) => {
            const deposits: Deposit[] = [];
            for(let i=numberOfWithdrawals; i>0; i--){
                deposits.push(
                    {
                        account: 2,
                        amount: randomNumber(-1000000, 1000000),
                        time: '2021-10-12T18:34:00Z'
                    }
                )
            }
            return deposits
        })(20)
        const accountData: AccountData = {
            name: 'dummy account',
            deposits,
            withdrawals: [],
            trades: []
        }
        const result = gainsGraphCalc(accountData);
        const defaultGraphItems: GainsGraphItem[] = [{tradeNo: 0, gainsPercent: 0}]
        const expectedResult: GainsGraphCalc = {
            todayGraphCalc: defaultGraphItems,
            thisWeekGraphCalc: defaultGraphItems,
            thisMonthGraphCalc: defaultGraphItems,
            thisYearGraphCalc: defaultGraphItems,
            allTimeGraphCalc: defaultGraphItems
        }
        test('it outputs the default output', () => {
            expect(result).toEqual(expectedResult);
        })
    })
    describe('When there are trades and deposits', () => {
        const tradeDateStr = '2021-10-13T18:34:00Z';
        const today = new Date(tradeDateStr);
        const noOfTrades = 20;
        // All deposits happen on 12th October, 2021
        const deposits: Deposit[] = ((numberOfDeposits) => {
            const deposits: Deposit[] = [];
            for(let i=numberOfDeposits; i>0; i--){
                deposits.push(
                    {account: 2, amount: randomNumber(-10000000, 100000000), time: '2021-10-12T18:34:00Z'}
                )
            }
            return deposits
        })(noOfTrades);
        // All trades happen on 13th October, 2021 (today)
        const trades: Trade[] = ((numberOfTrades) => {
            const trades: Trade[] = [];
            for(let i=numberOfTrades; i>0; i--){
                trades.push(newTrade({date: tradeDateStr}));
            }
            return trades
        })(noOfTrades);
        const accountData = {
            name: 'dummy account',
            deposits,
            withdrawals: [],
            trades
        }
        const totalDeposits = sumObjArray(deposits, 'amount');
        const expectedResultGainsGraphItems: GainsGraphItem[] = [
            {tradeNo: 0, gainsPercent: 0},
            ...trades.map((trade, i) => ({
                tradeNo: i + 1,
                gainsPercent: (trade.profitLoss / totalDeposits) * 100
            }))
        ];
        const result = gainsGraphCalc(accountData, today);
        const expectedResult: GainsGraphCalc = {
            todayGraphCalc: expectedResultGainsGraphItems,
            thisWeekGraphCalc: expectedResultGainsGraphItems,
            thisMonthGraphCalc: expectedResultGainsGraphItems,
            thisYearGraphCalc: expectedResultGainsGraphItems,
            allTimeGraphCalc: expectedResultGainsGraphItems
        }
        test('it outputs the correct gainsPercents', () => {
            expect(result).toEqual(expectedResult);
        })
    })
})
