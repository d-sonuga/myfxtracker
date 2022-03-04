import {AveReturnsPerPairGraphCalc, AveRrrPerPairGraphCalc} from '@root/index'
import {AccountData, Trade} from '@root/types'
import {sum} from '@root/utils'
import aveRrrPerPairGraphCalc from '../ave-rrr-per-pair-graph-calc'


describe('Verify that aveRrrPerPairGraphCalc is working', () => {
    describe('When there are no trades', () => {
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: []
        }
        const result = aveRrrPerPairGraphCalc(accountData);
        const expectedResult: AveReturnsPerPairGraphCalc = [];
        test('it outputs an empty array', () => {
            expect(result).toEqual(expectedResult);
        })
    })
    describe('When there is 1 profitable trade', () => {
        const pair = 'GBPUSD';
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: [
                {
                    pair,
                    action: 'buy',
                    commission: 20,
                    takeProfit: 20,
                    stopLoss: 32,
                    swap: 20,
                    profitLoss: 200,
                    openTime: '2022-09-04T13:02:00Z',
                    closeTime: '2022-09-04T13:02:00Z',
                    openPrice: 0,
                    closePrice: 0
                }
            ]
        }
        const result = aveRrrPerPairGraphCalc(accountData);
        const expectedResult: AveRrrPerPairGraphCalc = [
            {pair, rrr: 0}
        ]
        test('it outputs the correct result', () => {
            expect(result).toEqual(expectedResult);
        })
    })
    describe('When there is 1 losing trade', () => {
        const pair = 'GBPUSD';
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: [
                {
                    pair,
                    action: 'buy',
                    commission: 20,
                    takeProfit: 20,
                    stopLoss: 32,
                    swap: 20,
                    profitLoss: -200,
                    openTime: '2022-09-04T13:02:00Z',
                    closeTime: '2022-09-04T13:02:00Z',
                    openPrice: 0,
                    closePrice: 0
                }
            ]
        }
        const result = aveRrrPerPairGraphCalc(accountData);
        const expectedResult: AveRrrPerPairGraphCalc = [
            {pair, rrr: 0}
        ]
        test('it outputs the correct result', () => {
            expect(result).toEqual(expectedResult);
        })
    })
    describe('When there are a few profitable and losing trades on 1 pair', () => {
        const pair = 'GBPUSD';
        const profits = [200, 100, 100]
        const losses = [-10, -57];
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: [
                {
                    pair,
                    action: 'buy',
                    commission: 20,
                    takeProfit: 20,
                    stopLoss: 32,
                    swap: 20,
                    profitLoss: profits[0],
                    openTime: '2022-09-04T13:02:00Z',
                    closeTime: '2022-09-04T13:02:00Z',
                    openPrice: 0,
                    closePrice: 0
                },
                {
                    pair,
                    action: 'buy',
                    commission: 20,
                    takeProfit: 20,
                    stopLoss: 32,
                    swap: 20,
                    profitLoss: losses[0],
                    openTime: '2022-09-04T13:02:00Z',
                    closeTime: '2022-09-04T13:02:00Z',
                    openPrice: 0,
                    closePrice: 0
                },
                {
                    pair,
                    action: 'buy',
                    commission: 20,
                    takeProfit: 20,
                    stopLoss: 32,
                    swap: 20,
                    profitLoss: profits[1],
                    openTime: '2022-09-04T13:02:00Z',
                    closeTime: '2022-09-04T13:02:00Z',
                    openPrice: 0,
                    closePrice: 0
                },
                {
                    pair,
                    action: 'buy',
                    commission: 20,
                    takeProfit: 20,
                    stopLoss: 32,
                    swap: 20,
                    profitLoss: profits[2],
                    openTime: '2022-09-04T13:02:00Z',
                    closeTime: '2022-09-04T13:02:00Z',
                    openPrice: 0,
                    closePrice: 0
                },
                {
                    pair,
                    action: 'buy',
                    commission: 20,
                    takeProfit: 20,
                    stopLoss: 32,
                    swap: 20,
                    profitLoss: losses[1],
                    openTime: '2022-09-04T13:02:00Z',
                    closeTime: '2022-09-04T13:02:00Z',
                    openPrice: 0,
                    closePrice: 0
                },
            ]
        }
        const aveProfit = (sum(profits) / profits.length);
        const aveLoss = -1 * (sum(losses) / losses.length);
        const result = aveRrrPerPairGraphCalc(accountData);
        const expectedResult: AveRrrPerPairGraphCalc = [
            {pair, rrr: aveProfit / aveLoss}
        ]
        test('it outputs the correct result', () => {
            expect(result).toEqual(expectedResult);
        })
    })
    describe('When there are a few profitable and losing trades on more than 1 pair', () => {
        const pairs = ['GBPUSD', 'USDNOK'];
        const profits = [200, 100, 100]
        const losses = [-10, -57];
        const baseTrades: Trade[] = [
            {
                action: 'buy',
                commission: 20,
                takeProfit: 20,
                stopLoss: 32,
                swap: 20,
                profitLoss: profits[0],
                openTime: '2022-09-04T13:02:00Z',
                closeTime: '2022-09-04T13:02:00Z',
                openPrice: 0,
                closePrice: 0
            },
            {
                action: 'buy',
                commission: 20,
                takeProfit: 20,
                stopLoss: 32,
                swap: 20,
                profitLoss: losses[0],
                openTime: '2022-09-04T13:02:00Z',
                closeTime: '2022-09-04T13:02:00Z',
                openPrice: 0,
                closePrice: 0
            },
            {
                action: 'buy',
                commission: 20,
                takeProfit: 20,
                stopLoss: 32,
                swap: 20,
                profitLoss: profits[1],
                openTime: '2022-09-04T13:02:00Z',
                closeTime: '2022-09-04T13:02:00Z',
                openPrice: 0,
                closePrice: 0
            },
            {
                action: 'buy',
                commission: 20,
                takeProfit: 20,
                stopLoss: 32,
                swap: 20,
                profitLoss: profits[2],
                openTime: '2022-09-04T13:02:00Z',
                closeTime: '2022-09-04T13:02:00Z',
                openPrice: 0,
                closePrice: 0
            },
            {
                action: 'buy',
                commission: 20,
                takeProfit: 20,
                stopLoss: 32,
                swap: 20,
                profitLoss: losses[1],
                openTime: '2022-09-04T13:02:00Z',
                closeTime: '2022-09-04T13:02:00Z',
                openPrice: 0,
                closePrice: 0
            },
        ]
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: (() => {
                const trades: Trade[] = [];
                for(const pair of pairs){
                    baseTrades.forEach((trade) => {
                        trades.push({...trade, pair});
                    })
                }
                return trades;
            })()
        }
        const aveProfit = (sum(profits) / profits.length)
        const aveLoss = -1 * (sum(losses) / losses.length)
        const result = aveRrrPerPairGraphCalc(accountData);
        const expectedResult: AveRrrPerPairGraphCalc = pairs.map((pair) => ({
            pair, rrr: aveProfit / aveLoss
        }))
        test('it outputs the correct result', () => {
            expect(result).toEqual(expectedResult);
        })
    })
})