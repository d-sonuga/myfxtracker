import _ from 'lodash'
import {OpenHourTableCalc, OpenHourTableCalcItem} from '@root/index'
import {AccountData, Trade} from '@root/types'
import {randomInt, randomNumber} from '@root/utils'
import openHourTableCalc from '../open-hour-table-calc'
import {randomDate, randomTime} from './utils'


const generateTrades = (min: number = 2, max: number = 10000) => {
    const trades: Trade[] = [];
    const noOfTrades = randomInt(min, max);
    const newTrade = (): Trade => {
        const time = `${randomDate()}T${randomTime()}`;
        return {
            pair: 'USDNOK',
            action: 'buy',
            riskRewardRatio: 0,
            profitLoss: randomNumber(-100000, 100000),
            takeProfit: 0,
            stopLoss: 0,
            openTime: time,
            closeTime: time
        }
    }
    for(let i=0; i<noOfTrades; i++){
        trades.push(newTrade());
    }
    return trades;
}

describe('Verify openHourTableCalc is working', () => {
    describe('When there are no trades', () => {
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: []
        }
        const result = openHourTableCalc(accountData);
        const expectedResult: OpenHourTableCalc = [];
        test('it should output an empty array', () => {
            expect(result).toEqual(expectedResult);
        })
    })
    describe('When there is 1 trade', () => {
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: [
                {
                    pair: 'GBPUSD',
                    openTime: '2022-02-08T13:04:00Z',
                    closeTime: '2022-02-08T13:04:00Z',
                    profitLoss: 300,
                    takeProfit: 0,
                    stopLoss: 0,
                    riskRewardRatio: 0,
                    action: 'buy'
                }
            ]
        }
        const result = openHourTableCalc(accountData);
        const expectedResult: OpenHourTableCalc = [
            {hour: '13:00 - 13:59', result: 300, noOfTrades: 1}
        ];
        test('it should output the correct result', () => {
            expect(result).toEqual(expectedResult);
        })
    })
    describe('When there is more than 1 trade', () => {
        const baseTrade = {
            pair: 'GBPUSD',
            profitLoss: 300,
            takeProfit: 0,
            stopLoss: 0,
            riskRewardRatio: 0,
            action: 'buy'
        }
        const profitLoss12 = [300, -12, 233, 433];
        const profitLoss13 = [23, 455, 132];
        const profitLoss8 = [32, 45];
        const profitLoss15 = [34, 543, -10000];
        const trades: Trade[] = [
            {   
                ...baseTrade,
                openTime: '2021-03-10T12:04:00Z',
                closeTime: '2021-03-11T12:04:00Z',
                profitLoss: profitLoss12[0]
            },
            {   
                ...baseTrade,
                openTime: '2022-02-23T12:20:00Z',
                closeTime: '2022-02-24T13:12:00Z',
                profitLoss: profitLoss12[1]
            },
            {   
                ...baseTrade,
                openTime: '2022-02-08T12:34:00Z',
                closeTime: '2022-02-08T12:34:00Z',
                profitLoss: profitLoss12[2]
            },
            {   
                ...baseTrade,
                openTime: '2022-02-08T12:04:00Z',
                closeTime: '2022-02-08T12:04:00Z',
                profitLoss: profitLoss12[3]
            },
            {   
                ...baseTrade,
                openTime: '2022-02-08T13:04:00Z',
                closeTime: '2022-02-08T13:04:00Z',
                profitLoss: profitLoss13[0]
            },
            {   
                ...baseTrade,
                openTime: '2022-02-08T13:04:00Z',
                closeTime: '2022-02-08T13:04:00Z',
                profitLoss: profitLoss13[1]
            },
            {   
                ...baseTrade,
                openTime: '2022-02-08T13:04:00Z',
                closeTime: '2022-02-08T13:04:00Z',
                profitLoss: profitLoss13[2]
            },
            {   
                ...baseTrade,
                openTime: '2022-02-08T08:04:00Z',
                closeTime: '2022-02-08T13:04:00Z',
                profitLoss: profitLoss8[0]
            },
            {   
                ...baseTrade,
                openTime: '2022-02-08T08:04:00Z',
                closeTime: '2022-02-08T08:04:00Z',
                profitLoss: profitLoss8[1]
            },
            {   
                ...baseTrade,
                openTime: '2022-02-08T15:04:00Z',
                closeTime: '2022-02-08T15:04:00Z',
                profitLoss: profitLoss15[0]
            },
            {   
                ...baseTrade,
                openTime: '2022-02-08T15:04:00Z',
                closeTime: '2022-02-08T15:04:00Z',
                profitLoss: profitLoss15[1]
            },
            {   
                ...baseTrade,
                openTime: '2022-02-08T15:04:00Z',
                closeTime: '2022-02-08T15:04:00Z',
                profitLoss: profitLoss15[2]
            },
        ]
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades
        }
        const result = openHourTableCalc(accountData);
        const expectedResult: OpenHourTableCalc = [
            {hour: '12:00 - 12:59', noOfTrades: profitLoss12.length, result: _.sum(profitLoss12)},
            {hour: '13:00 - 13:59', noOfTrades: profitLoss13.length, result: _.sum(profitLoss13)},
            {hour: '08:00 - 08:59', noOfTrades: profitLoss8.length, result: _.sum(profitLoss8)},
            {hour: '15:00 - 15:59', noOfTrades: profitLoss15.length, result: _.sum(profitLoss15)},
        ]
        test('it should output the correct result', () => {
            expect(result).toEqual(expectedResult);
        })
    })
    describe('When there is more than 1 trade, all random', () => {
        const trades: Trade[] = generateTrades();
        const accountData: AccountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades
        }
        const result = openHourTableCalc(accountData);
        const expectedResult: OpenHourTableCalc = (() => {
            const hourMap: {[key: string]: Omit<OpenHourTableCalcItem, 'hour'>} = {};
            const format = (openTime: string): string => {
                const hour = openTime.split('T')[1].split(':')[0];
                return `${hour}:00 - ${hour}:59`;
            }
            for(const trade of trades){
                const hour = format(trade.openTime);
                if(!(hour in hourMap)){
                    hourMap[hour] = {result: 0, noOfTrades: 0}
                }
                hourMap[hour].result += trade.profitLoss;
                hourMap[hour].noOfTrades += 1;
            }
            return Object.keys(hourMap).map((hour) => ({
                hour, result: hourMap[hour].result, noOfTrades: hourMap[hour].noOfTrades
            }))
        })();
        test('it should output the correct result', () => {
            expect(result).toEqual(expectedResult);
        })
    })
})