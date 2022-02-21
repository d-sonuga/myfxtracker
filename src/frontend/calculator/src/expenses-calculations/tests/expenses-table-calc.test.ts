import {AccountData, Trade} from '@root/types'
import {randomNumber} from '@root/utils'
import expensesTableCalc from '../expenses-table-calc'
import {ExpensesTableCalc} from '../types'

/** @Note These tests are far from complete */

const newTrade = (pair: string, commission: number, swap: number): Trade => {
    return {
        pair,
        commission,
        swap,
        profitLoss: randomNumber(-10000, 10000),
        takeProfit: 0,
        stopLoss: 0,
        action: 'buy',
        riskRewardRatio: 0,
        openTime: '2022-10-23T13:23:00Z',
        closeTime: '2022-10-23T13:23:00Z'
    }
}

describe('Verify that expensesTableCalc is working', () => {
    describe('When accountData.trades is empty', () => {
        const accountData: AccountData = {
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
    describe('When accountData.trades has 1 trade', () => {
        const pair = 'GBPUSD';
        const commission = 20;
        const swap = 23;
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: [
                newTrade(pair, commission, swap)
            ]
        }
        const result = expensesTableCalc(accountData);
        const expectedResult: ExpensesTableCalc = [
            {pair, commission, swap}
        ];
        test('it ouputs the correct result', () => {
            expect(result).toEqual(expectedResult);
        })
    })
    describe('When accountData.trades has a few trades', () => {
        const somePairs = ['GBPUSD', 'USDNOK', 'USDSEK', 'EURUSD', 'GBPNZD', 'JPYUSD'];
        const noOfTradesPerPair = 50;
        const pairTradeMap: {[key: string]: Trade[]} = {}
        for(const pair of somePairs){
            pairTradeMap[pair] = (() => {
                const trades: Trade[] = [];
                for(let i=0; i<noOfTradesPerPair; i++){
                    trades.push(newTrade(pair, randomNumber(0, 10000), randomNumber(0, 1000)));
                }
                return trades;
            })()
        }
        const trades: Trade[] = (() => {
            let allTrades: Trade[] = []
            somePairs.forEach((pair) => {
                allTrades = [...allTrades, ...pairTradeMap[pair]];
            });
            return allTrades;
        })()
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades
        }
        const result = expensesTableCalc(accountData);
        const expectedResult: ExpensesTableCalc = Object.keys(pairTradeMap).map((pair) => {
            let commission = 0;
            let swap = 0;
            pairTradeMap[pair].forEach((trade) => {
                commission += trade.commission || 0;
                swap += trade.swap || 0;
            })
            return {
                pair,
                commission,
                swap
            }
        })
        test('it outputs the correct result', () => {
            expect(result).toEqual(expectedResult);
        })
    })
})