import {AccountData, Deposit, Withdrawal, Trade} from '@root/types'
import {randomNumber} from '@root/utils'
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
    const tradeDateStr = '2022-10-20T18:34:00Z';
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
    describe('When there are many shorts', () => {
        const createTrade = (date: string): Trade => ({
            pair: 'GBPJPY',
            action: 'sell',
            openTime: date,
            closeTime: date,
            riskRewardRatio: 3,
            profitLoss: randomNumber(-100000000, 100000000),
            pips: 3,
            notes: '',
            entryImageLink: '',
            exitImageLink: '',
            lots: 3,
            commission: 2.3,
            swap: 3,
            takeProfit: 0,
            stopLoss: 0
        })
        const createTradeSet = (date: string, noOfTrades: number): Trade[] => {
            const trades: Trade[] = [];
            for(let i=0; i<noOfTrades; i++){
                trades.push(createTrade(date));
            }
            return trades
        }
        // 14th October, 2021
        const todayDateStr = '2021-10-14T12:09:00Z';
        const thisWeekDateStr = '2021-10-12T12:09:00Z';
        const thisMonthDateStr = '2021-10-04T12:09:00Z';
        const thisYearDateStr = '2021-08-04T12:09:00Z';
        const lastYearDateStr = '2020-08-04T12:09:00Z';
        const todayTrades: Trade[] = createTradeSet(todayDateStr, 20);
        const thisWeekTrades: Trade[] = createTradeSet(thisWeekDateStr, 34);
        const thisMonthTrades: Trade[] = createTradeSet(thisMonthDateStr, 23);
        const thisYearTrades: Trade[] = createTradeSet(thisYearDateStr, 33);
        const lastYearTrades: Trade[] = createTradeSet(lastYearDateStr, 23);
        const accountData: AccountData = {
            name: 'dummy account',
            trades: [
                ...lastYearTrades,
                ...thisYearTrades,
                ...thisMonthTrades,
                ...thisWeekTrades,
                ...todayTrades
            ],
            deposits: [],
            withdrawals: []
        };

        const result = shortBalanceGraphCalc(accountData);
        const expectedResult: ShortBalanceGraphCalc = (() => {
            const tradeSet = [lastYearTrades, thisYearTrades, thisMonthTrades, thisWeekTrades, todayTrades];
            let tradeNo = 0;
            let cummulativeResult = 0;
            const result: ShortBalanceGraphCalc = [{tradeNo: 0, result: 0}];
            for(const trades of tradeSet){
                for(const trade of trades){
                    tradeNo += 1;
                    cummulativeResult += trade.profitLoss;
                    result.push({
                        tradeNo,
                        result: cummulativeResult
                    })
                }
            }
            return result;
        })()
        test('it outputs the expected result', () => {
            expect(result).toEqual(expectedResult);
        })
    })
})
