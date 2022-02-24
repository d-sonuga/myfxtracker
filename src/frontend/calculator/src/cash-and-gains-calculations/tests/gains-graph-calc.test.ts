import {GainsGraphCalc} from '@root/index'
import {AccountData, Deposit, Trade, Withdrawal} from '@root/types'
import {randomNumber, sumObjArray} from '@root/utils'
import gainsGraphCalc from '../gains-graph-calc'
import {GainsGraphItem} from '../types'


describe('Verify gainsGraphCalc is working', () => {
    /** To create a new trade object without having to specify all trade attributes */
    const newTrade = (attr: Partial<Trade> & {date?: string}) => {
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
    /*
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
    */
    describe('When there are some trades and deposits', () => {
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
        const expectedResultGainsGraphItems: GainsGraphItem[] = (() => {
            const totalDeposits = sumObjArray(deposits, 'amount');
            let cummulativeProfitLoss = 0;
            return [
                {tradeNo: 0, gainsPercent: 0},
                ...trades.map((trade, i) => {
                    cummulativeProfitLoss += trade.profitLoss;
                    return {
                        tradeNo: i + 1,
                        gainsPercent: (cummulativeProfitLoss / totalDeposits) * 100
                    }
                })
            ]
        })();
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
    /*
    describe('When there are some trades and deposits', () => {
        const createTrades = (noOfTrades: number, date: string): Trade[] => {
            const trades: Trade[] = [];
            for(let i=0; i<noOfTrades; i++){
                trades.push(newTrade({date: todayStr}))
            }
            return trades;
        }
        const createDeposits = (noOfDeposits: number, date: string): Deposit[] => {
            const deposits: Deposit[] = [];
            for(let i=0; i<noOfDeposits; i++){
                deposits.push({account: 1, amount: randomNumber(1, 10000), time: date})
            }
            return deposits
        }
        const createWithdrawals = (noOfWithdrawals: number, date: string): Withdrawal[] => {
            const withdrawals: Withdrawal[] = [];
            for(let i=0; i<noOfWithdrawals; i++){
                withdrawals.push({account: 1, amount: randomNumber(1, 10000), time: date})
            }
            return withdrawals
        }
        type Dataset = [Trade[], Deposit[], Withdrawal[]];
        const createDataSet = (noOfTrades: number, noOfDeposits: number, 
            noOfWithdrawals: number, date: string): Dataset => {
                return [
                    createTrades(noOfTrades, date),
                    createDeposits(noOfDeposits, date),
                    createWithdrawals(noOfWithdrawals, date)
                ];
        }
        const sumAmount = (...args: (Trade[] | Deposit[])[]): number => {
            let amount = 0;
            for(const arg of args){
                for(const transaction of arg){
                    if('amount' in transaction){
                        amount += transaction.amount;
                    } else {
                        amount += transaction.profitLoss;
                    }
                }
            }
            return amount;
        }
        // 2nd November, 2021
        const today = new Date(2021, 10, 2);
        const todayStr = '2021-11-18T18:34:00Z';
        const thisWeekStr = '2021-11-15T18:34:00Z';
        const thisMonthStr = '2021-11-03T18:34:00Z';
        const thisYearStr = '2021-09-03T18:34:00Z';
        const lastYearStr = '2020-09-03T18:34:00Z';
        const [
            todayTrades, todayDeposits, todayWithdrawals
        ]: Dataset = createDataSet(20, 4, 4, todayStr);
        const [
            thisWeekTrades, thisWeekDeposits, thisWeekWithdrawals
        ]: Dataset = createDataSet(23, 3, 7, thisWeekStr);
        const [
            thisMonthTrades, thisMonthDeposits, thisMonthWithdrawals
        ]: Dataset = createDataSet(9, 8, 2, thisMonthStr);
        const [
            thisYearTrades, thisYearDeposits, thisYearWithdrawals
        ] = createDataSet(9, 8, 7, thisYearStr);
        const [
            lastYearTrades, lastYearDeposits, lastYearWithdrawals
        ]: Dataset = createDataSet(9, 10, 9, lastYearStr);
        const accountData: AccountData = {
            name: 'dummy account',
            trades: [
                ...lastYearTrades,
                ...thisYearTrades,
                ...thisMonthTrades,
                ...thisWeekTrades,
                ...todayTrades,
            ],
            deposits: [
                ...lastYearDeposits,
                ...thisYearDeposits,
                ...thisMonthDeposits,
                ...thisWeekDeposits,
                ...todayDeposits
            ],
            withdrawals: [
                ...lastYearWithdrawals,
                ...thisYearWithdrawals,
                ...thisMonthWithdrawals,
                ...thisWeekWithdrawals,
                ...todayWithdrawals
            ]
        }
        const defaultResult: GainsGraphItem = {tradeNo: 0, gainsPercent: 0};
        const expectedTodayGraphCalc: GainsGraphCalc['todayGraphCalc'] = (() => {
            let deposits = sumAmount(todayDeposits);
            let amount = 0;
            const result = [defaultResult];
            let tradeNo = 1;
            for(const trade of todayTrades){
                amount += trade.profitLoss;
                result.push({tradeNo, gainsPercent: (amount/deposits) * 100})
                tradeNo += 1;
            }
            return result;
        })()
        const expectedThisWeekGraphCalc = (() => {
            let todayDepositAmount = sumAmount(todayDeposits);
            let totalDeposits = sumAmount(thisWeekDeposits);
            let amount = 0;
            const result = [defaultResult];
            let tradeNo = 1;
            for(const trade of thisWeekTrades){
                amount += trade.profitLoss;
                result.push({tradeNo, gainsPercent: (amount/totalDeposits) * 100})
                tradeNo += 1;
            }
            totalDeposits += todayDepositAmount;
            for(const trade of todayTrades){
                amount += trade.profitLoss;
                result.push({tradeNo, gainsPercent: (amount/totalDeposits) * 100})
                tradeNo += 1;
            }
            return result;
        })()
        const expectedThisMonthGraphCalc = (() => {
            let todayDepositAmount = sumAmount(todayDeposits);
            let thisWeekDepositAmount = sumAmount(thisWeekDeposits);
            let totalDeposits = sumAmount(thisMonthDeposits);
            let amount = 0;
            const result = [defaultResult];
            let tradeNo = 1;
            for(const trade of thisMonthTrades){
                amount += trade.profitLoss;
                result.push({tradeNo, gainsPercent: (amount/totalDeposits) * 100})
                tradeNo += 1;
            }
            totalDeposits += thisWeekDepositAmount
            for(const trade of thisWeekTrades){
                amount += trade.profitLoss;
                result.push({tradeNo, gainsPercent: (amount/totalDeposits) * 100})
                tradeNo += 1;
            }
            totalDeposits += todayDepositAmount;
            totalDeposits += todayDepositAmount;
            for(const trade of todayTrades){
                amount += trade.profitLoss;
                result.push({tradeNo, gainsPercent: (amount/totalDeposits) * 100})
                tradeNo += 1;
            }
            return result;
        })()
        const expectedThisYearGraphCalc = (() => {
            let todayDepositAmount = sumAmount(todayDeposits);
            let thisWeekDepositAmount = sumAmount(thisWeekDeposits);
            let thisMonthDepositAmount = sumAmount(thisMonthDeposits);
            let totalDeposits = sumAmount(thisYearDeposits);
            let amount = 0;
            const result = [defaultResult];
            let tradeNo = 1;
            for(const trade of thisYearTrades){
                amount += trade.profitLoss;
                result.push({tradeNo, gainsPercent: (amount/totalDeposits) * 100})
                tradeNo += 1;
            }
            totalDeposits += thisMonthDepositAmount;
            for(const trade of thisMonthTrades){
                amount += trade.profitLoss;
                result.push({tradeNo, gainsPercent: (amount/totalDeposits) * 100})
                tradeNo += 1;
            }
            totalDeposits += thisWeekDepositAmount
            for(const trade of thisWeekTrades){
                amount += trade.profitLoss;
                result.push({tradeNo, gainsPercent: (amount/totalDeposits) * 100})
                tradeNo += 1;
            }
            totalDeposits += todayDepositAmount;
            totalDeposits += todayDepositAmount;
            for(const trade of todayTrades){
                amount += trade.profitLoss;
                result.push({tradeNo, gainsPercent: (amount/totalDeposits) * 100})
                tradeNo += 1;
            }
            return result;
        })()
        const expectedAllTimeGraphCalc = (() => {
            let todayDepositAmount = sumAmount(todayDeposits);
            let thisWeekDepositAmount = sumAmount(thisWeekDeposits);
            let thisMonthDepositAmount = sumAmount(thisMonthDeposits);
            let thisYearDepositAmount = sumAmount(thisYearDeposits);
            let totalDeposits = sumAmount(lastYearDeposits);
            let amount = 0;
            const result = [defaultResult];
            let tradeNo = 1;
            for(const trade of lastYearTrades){
                amount += trade.profitLoss;
                result.push({tradeNo, gainsPercent: (amount/totalDeposits) * 100})
                tradeNo += 1;
            }
            totalDeposits += thisYearDepositAmount;
            for(const trade of thisYearTrades){
                amount += trade.profitLoss;
                result.push({tradeNo, gainsPercent: (amount/totalDeposits) * 100})
                tradeNo += 1;
            }
            totalDeposits += thisMonthDepositAmount;
            for(const trade of thisMonthTrades){
                amount += trade.profitLoss;
                result.push({tradeNo, gainsPercent: (amount/totalDeposits) * 100})
                tradeNo += 1;
            }
            totalDeposits += thisWeekDepositAmount
            for(const trade of thisWeekTrades){
                amount += trade.profitLoss;
                result.push({tradeNo, gainsPercent: (amount/totalDeposits) * 100})
                tradeNo += 1;
            }
            totalDeposits += todayDepositAmount;
            totalDeposits += todayDepositAmount;
            for(const trade of todayTrades){
                amount += trade.profitLoss;
                result.push({tradeNo, gainsPercent: (amount/totalDeposits) * 100})
                tradeNo += 1;
            }
            return result;
        })()
        const result = gainsGraphCalc(accountData, today);
        const expectedResult: GainsGraphCalc = {
            todayGraphCalc: expectedTodayGraphCalc,
            thisWeekGraphCalc: expectedThisWeekGraphCalc,
            thisMonthGraphCalc: expectedThisMonthGraphCalc,
            thisYearGraphCalc: expectedThisYearGraphCalc,
            allTimeGraphCalc: expectedAllTimeGraphCalc
        }
        test('it outputs the expected result', () => {
            expect(result).toEqual(expectedResult);
        })
    })
    */
})
