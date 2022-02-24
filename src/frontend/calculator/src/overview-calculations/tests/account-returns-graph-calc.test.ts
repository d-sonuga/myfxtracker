import accountReturnsGraphCalc from '../account-returns-graph-calc'
import {OverviewAccountReturnsGraphCalc} from '../types'
import {AccountData, Deposit, Trade, Withdrawal} from '@root/types'


describe('Verify accountReturnsGraphCalc is working', () => {
    // Deposits and withdrawals are not needed for these tests,
    // because they aren't used to calculate anything for the 
    // account returns graph
    const dummyDeposits: Deposit[] = [];
    const dummyWithdrawals: Withdrawal[] = [];
    describe('When accountData.trades is empty (meaning no trades)', () => {
        const dummyTrades: Trade[] = [];
        const dummyAccountData: AccountData = {
            name: 'dummy account',
            deposits: dummyDeposits,
            withdrawals: dummyWithdrawals,
            trades: dummyTrades
        }
        const result: OverviewAccountReturnsGraphCalc = accountReturnsGraphCalc(dummyAccountData);
        // This defaultCalc is what all fields in the calc should have when
        // there are no trades
        const defaultCalc = [{tradeNo: 0, result: 0}];
        const expectedResult: OverviewAccountReturnsGraphCalc = {
            todayGraphCalc: defaultCalc,
            thisWeekGraphCalc: defaultCalc,
            thisMonthGraphCalc: defaultCalc,
            thisYearGraphCalc: defaultCalc,
            allTimeGraphCalc: defaultCalc
        }
        test('result should be only default values', () => {
            expect(result).toEqual(expectedResult);
        })
    });
    describe('When accountData.trades isn\'t empty', () => {
        describe('When the only trade taken is one from last year', () => {
            const today = new Date(2022, 0, 2);
            // No single trade taken in today's year
            const trades: Trade[] = [
                {
                    pair: 'GBPUSD',
                    action: 'buy',
                    openTime: '2021-02-01T18:34:00Z',
                    closeTime: '2021-02-01T18:43:00Z',
                    riskRewardRatio: 2.3,
                    profitLoss: 320,
                    pips: 2,
                    notes: '',
                    entryImageLink: '',
                    exitImageLink: '',
                    commission: 32,
                    swap: 32,
                    stopLoss: 0,
                    takeProfit: 0,
                    openPrice: 0,
                    closePrice: 0

                },
            ]
            const dummyAccountData: AccountData = {
                name: 'dummy account',
                deposits: dummyDeposits,
                withdrawals: dummyWithdrawals,
                trades
            }
            const result = accountReturnsGraphCalc(dummyAccountData, today);
            const defaultCalc = [{tradeNo: 0, result: 0}];
            const expectedResult: OverviewAccountReturnsGraphCalc = {
                todayGraphCalc: defaultCalc,
                thisWeekGraphCalc: defaultCalc,
                thisMonthGraphCalc: defaultCalc,
                thisYearGraphCalc: defaultCalc,
                allTimeGraphCalc: [...defaultCalc, {tradeNo: 1, result: trades[0].profitLoss}]
            }
            test('all results should be default values, except allTime ' + 
                'which should have the trade taken the year before today\'s year', () => {
                    expect(result).toEqual(expectedResult);
            })
        })
        describe('When the only trade taken is one this year, but not this month', () => {
            // 2nd April, 2022 (TS month field in constructor is 0-based)
            const today = new Date(2022, 3, 2);
            // Trade take on 2nd January, 2022
            const trades: Trade[] = [
                {
                    pair: 'GBPUSD',
                    action: 'buy',
                    openTime: '2022-02-01T18:34:00Z',
                    closeTime: '2022-02-01T18:34:00Z',
                    riskRewardRatio: 2.3,
                    profitLoss: 320,
                    pips: 2,
                    notes: '',
                    entryImageLink: '',
                    exitImageLink: '',
                    commission: 32,
                    swap: 32,
                    stopLoss: 0,
                    takeProfit: 0,
                    openPrice: 0,
                    closePrice: 0
                },
            ]
            const dummyAccountData: AccountData = {
                name: 'dummy account',
                deposits: dummyDeposits,
                withdrawals: dummyWithdrawals,
                trades
            }
            const result = accountReturnsGraphCalc(dummyAccountData, today);
            const defaultCalc = [{tradeNo: 0, result: 0}];
            const expectedResult: OverviewAccountReturnsGraphCalc = {
                todayGraphCalc: defaultCalc,
                thisWeekGraphCalc: defaultCalc,
                thisMonthGraphCalc: defaultCalc,
                thisYearGraphCalc: [...defaultCalc, {tradeNo: 1, result: trades[0].profitLoss}],
                allTimeGraphCalc: [...defaultCalc, {tradeNo: 1, result: trades[0].profitLoss}]
            }
            test('all results should be default values, except allTime and thisYear ', () => {
                    expect(result).toEqual(expectedResult);
            })
        })
        describe('When the only trade taken is one this month, but not this week', () => {
            // 22nd April, 2022 (TS month field in constructor is 0-based)
            const today = new Date(2022, 3, 22);
            // Trade take on 15th April, 2022
            const trades: Trade[] = [
                {
                    pair: 'GBPUSD',
                    action: 'buy',
                    openTime: '2022-04-15T18:34:00Z',
                    closeTime: '2022-04-15T18:34:00Z',
                    riskRewardRatio: 2.3,
                    profitLoss: 320,
                    pips: 2,
                    notes: '',
                    entryImageLink: '',
                    exitImageLink: '',
                    commission: 32,
                    swap: 32,
                    stopLoss: 0,
                    takeProfit: 0,
                    openPrice: 0,
                    closePrice: 0
                },
            ]
            const dummyAccountData: AccountData = {
                name: 'dummy account',
                deposits: dummyDeposits,
                withdrawals: dummyWithdrawals,
                trades
            }
            const result = accountReturnsGraphCalc(dummyAccountData, today);
            const defaultCalc = [{tradeNo: 0, result: 0}];
            const expectedResult: OverviewAccountReturnsGraphCalc = {
                todayGraphCalc: defaultCalc,
                thisWeekGraphCalc: defaultCalc,
                thisMonthGraphCalc: [...defaultCalc, {tradeNo: 1, result: trades[0].profitLoss}],
                thisYearGraphCalc: [...defaultCalc, {tradeNo: 1, result: trades[0].profitLoss}],
                allTimeGraphCalc: [...defaultCalc, {tradeNo: 1, result: trades[0].profitLoss}]
            }
            test('all results should be default values, except allTime, thisYear and thisMonth', () => {
                    expect(result).toEqual(expectedResult);
            })
        })
        describe('When the only trade taken is one this week, but not today', () => {
            // 22nd April, 2022 (TS month field in constructor is 0-based)
            const today = new Date(2022, 3, 22);
            // Trade take on 19th April, 2022
            const tradeDateStr = '2022-04-19T18:34:00Z';
            const trades: Trade[] = [
                {
                    pair: 'GBPUSD',
                    action: 'buy',
                    openTime: tradeDateStr,
                    closeTime: tradeDateStr,
                    riskRewardRatio: 2.3,
                    profitLoss: 320,
                    pips: 2,
                    notes: '',
                    entryImageLink: '',
                    exitImageLink: '',
                    lots: 2,
                    commission: 32,
                    swap: 32,
                    takeProfit: 0,
                    stopLoss: 0,
                    openPrice: 0,
                    closePrice: 0
                },
            ]
            const dummyAccountData: AccountData = {
                name: 'dummy account',
                deposits: dummyDeposits,
                withdrawals: dummyWithdrawals,
                trades
            }
            const defaultCalc = [{tradeNo: 0, result: 0}];
            const result = accountReturnsGraphCalc(dummyAccountData, today);
            const expectedResult: OverviewAccountReturnsGraphCalc = {
                todayGraphCalc: defaultCalc,
                thisWeekGraphCalc: [...defaultCalc, {tradeNo: 1, result: trades[0].profitLoss}],
                thisMonthGraphCalc: [...defaultCalc, {tradeNo: 1, result: trades[0].profitLoss}],
                thisYearGraphCalc: [...defaultCalc, {tradeNo: 1, result: trades[0].profitLoss}],
                allTimeGraphCalc: [...defaultCalc, {tradeNo: 1, result: trades[0].profitLoss}]
            }
            test('only today\'s results should be default values', () => {
                    expect(result).toEqual(expectedResult);
            })
        })
        describe('When the only trade taken is one today', () => {
            // 22nd April, 2022 (TS month field in constructor is 0-based)
            const today = new Date(2022, 3, 22);
            // Trade take on 16th April, 2022
            const tradeDateStr = '2022-04-22T18:34:00Z';
            const trades: Trade[] = [
                {
                    pair: 'GBPUSD',
                    action: 'buy',
                    openTime: tradeDateStr,
                    closeTime: tradeDateStr,
                    riskRewardRatio: 2.3,
                    profitLoss: 320,
                    pips: 2,
                    notes: '',
                    entryImageLink: '',
                    exitImageLink: '',
                    lots: 2,
                    commission: 32,
                    swap: 32,
                    takeProfit: 0,
                    stopLoss: 0,
                    openPrice: 0,
                    closePrice: 0
                },
            ]
            const dummyAccountData: AccountData = {
                name: 'dummy account',
                deposits: dummyDeposits,
                withdrawals: dummyWithdrawals,
                trades
            }
            const result = accountReturnsGraphCalc(dummyAccountData, today);
            const defaultCalc = [{tradeNo: 0, result: 0}];
            const expectedResult: OverviewAccountReturnsGraphCalc = {
                todayGraphCalc: [...defaultCalc, {tradeNo: 1, result: trades[0].profitLoss}],
                thisWeekGraphCalc: [...defaultCalc, {tradeNo: 1, result: trades[0].profitLoss}],
                thisMonthGraphCalc: [...defaultCalc, {tradeNo: 1, result: trades[0].profitLoss}],
                thisYearGraphCalc: [...defaultCalc, {tradeNo: 1, result: trades[0].profitLoss}],
                allTimeGraphCalc: [...defaultCalc, {tradeNo: 1, result: trades[0].profitLoss}]
            }
            test('all calcs should have the default values and the trade taken today', () => {
                    expect(result).toEqual(expectedResult);
            })
        })
        describe('When the a trade is taken today, this week, this month, ' +
            'this year and the previous year', () => {
            // 22nd April, 2022 (TS month field in constructor is 0-based)
            const today = new Date(2022, 3, 22);
            // Trade take on 16th April, 2022
            const todayDateStr = '2022-04-22T18:34:00Z'
            const thisWeekDateStr = '2022-04-20T18:34:00Z'
            const thisMonthDateStr = '2022-04-06T18:34:00Z'
            const thisYearDateStr = '2022-01-13T18:34:00Z'
            const lastYearDateStr = '2021-06-27T18:34:00Z'
            const baseTrade: Trade = {
                pair: 'GBPUSD',
                action: 'buy',
                riskRewardRatio: 2.3,
                profitLoss: 320,
                pips: 2,
                notes: '',
                entryImageLink: '',
                exitImageLink: '',
                lots: 2,
                commission: 32,
                swap: 32,
                stopLoss: 0,
                takeProfit: 0,
                openTime: todayDateStr,
                closeTime: todayDateStr,
                openPrice: 0,
                closePrice: 0
            }
            const trades: Trade[] = [
                {
                    ...baseTrade,
                    openTime: lastYearDateStr, closeTime: lastYearDateStr
                },
                {
                    ...baseTrade,
                    openTime: thisYearDateStr, closeTime: thisYearDateStr
                },
                {
                    ...baseTrade,
                    openTime: thisMonthDateStr, closeTime: thisMonthDateStr
                },
                {
                    ...baseTrade,
                    openTime: thisWeekDateStr, closeTime: thisWeekDateStr
                },
                {
                    ...baseTrade,
                    openTime: todayDateStr, closeTime: todayDateStr
                }
            ]
            const dummyAccountData: AccountData = {
                name: 'dummy account',
                deposits: dummyDeposits,
                withdrawals: dummyWithdrawals,
                trades
            }
            const result = accountReturnsGraphCalc(dummyAccountData, today);
            const defaultCalc = [{tradeNo: 0, result: 0}];
            const expectedTodayCalc = [...defaultCalc, {tradeNo: 1, result: trades[4].profitLoss}];
            const expectedThisWeekCalc = [...defaultCalc,
                {tradeNo: 1, result: trades[3].profitLoss},
                {tradeNo: 2, result: trades[3].profitLoss + trades[4].profitLoss}
            ]
            const expectedThisMonthCalc = [...defaultCalc,
                {tradeNo: 1, result: trades[2].profitLoss},
                {tradeNo: 2, result: trades[2].profitLoss + trades[3].profitLoss},
                {tradeNo: 3, result: trades[2].profitLoss + trades[3].profitLoss + trades[4].profitLoss}
            ];
            const expectedThisYearCalc = [...defaultCalc,
                {tradeNo: 1, result: trades[1].profitLoss},
                {tradeNo: 2, result: trades[1].profitLoss + trades[2].profitLoss},
                {tradeNo: 3, result: trades[1].profitLoss + trades[2].profitLoss + trades[3].profitLoss},
                {tradeNo: 4, result: trades[1].profitLoss + trades[2].profitLoss + trades[3].profitLoss
                    + trades[4].profitLoss},
            ];
            const expectedAllTimeCalc = [...defaultCalc,
                {tradeNo: 1, result: trades[0].profitLoss},
                {tradeNo: 2, result: trades[0].profitLoss + trades[1].profitLoss},
                {tradeNo: 3, result: trades[0].profitLoss + trades[1].profitLoss + trades[2].profitLoss},
                {tradeNo: 4, result: trades[0].profitLoss + trades[1].profitLoss + trades[2].profitLoss
                    + trades[3].profitLoss},
                {tradeNo: 5, result: trades[0].profitLoss + trades[1].profitLoss + trades[2].profitLoss
                    + trades[3].profitLoss + trades[4].profitLoss}
            ];

            const expectedResult: OverviewAccountReturnsGraphCalc = {
                todayGraphCalc: expectedTodayCalc,
                thisWeekGraphCalc: expectedThisWeekCalc,
                thisMonthGraphCalc: expectedThisMonthCalc,
                thisYearGraphCalc: expectedThisYearCalc,
                allTimeGraphCalc: expectedAllTimeCalc
            }
            test('all calcs should have the default values and the trades taken during ' +
                'their respective periods', () => {
                    expect(result).toEqual(expectedResult);
            })
        })
    })
})
