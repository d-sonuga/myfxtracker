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
            const trades = [
                {
                    pair: 'GBPUSD',
                    action: 'buy',
                    entry_date: '2021-01-02',
                    exit_date: '2021-01-02',
                    risk_reward_ratio: 2.3,
                    profit_loss: 320,
                    pips: 2,
                    notes: '',
                    entry_image_link: '',
                    exit_image_link: '',
                    date_added: '2022-01-02',
                    lots: 2,
                    commissions: 32,
                    swap: 32
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
                allTimeGraphCalc: [...defaultCalc, {tradeNo: 1, result: trades[0].profit_loss}]
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
            const trades = [
                {
                    pair: 'GBPUSD',
                    action: 'buy',
                    entry_date: '2022-01-02',
                    exit_date: '2022-01-02',
                    risk_reward_ratio: 2.3,
                    profit_loss: 320,
                    pips: 2,
                    notes: '',
                    entry_image_link: '',
                    exit_image_link: '',
                    date_added: '2022-01-02',
                    lots: 2,
                    commissions: 32,
                    swap: 32
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
                thisYearGraphCalc: [...defaultCalc, {tradeNo: 1, result: trades[0].profit_loss}],
                allTimeGraphCalc: [...defaultCalc, {tradeNo: 1, result: trades[0].profit_loss}]
            }
            test('all results should be default values, except allTime and thisYear ', () => {
                    expect(result).toEqual(expectedResult);
            })
        })
        describe('When the only trade taken is one this month, but not this week', () => {
            // 22nd April, 2022 (TS month field in constructor is 0-based)
            const today = new Date(2022, 3, 22);
            // Trade take on 16th April, 2022
            const trades = [
                {
                    pair: 'GBPUSD',
                    action: 'buy',
                    entry_date: '2022-04-16',
                    exit_date: '2022-04-16',
                    risk_reward_ratio: 2.3,
                    profit_loss: 320,
                    pips: 2,
                    notes: '',
                    entry_image_link: '',
                    exit_image_link: '',
                    date_added: '2022-01-02',
                    lots: 2,
                    commissions: 32,
                    swap: 32
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
                thisMonthGraphCalc: [...defaultCalc, {tradeNo: 1, result: trades[0].profit_loss}],
                thisYearGraphCalc: [...defaultCalc, {tradeNo: 1, result: trades[0].profit_loss}],
                allTimeGraphCalc: [...defaultCalc, {tradeNo: 1, result: trades[0].profit_loss}]
            }
            test('all results should be default values, except allTime, thisYear and thisMonth', () => {
                    expect(result).toEqual(expectedResult);
            })
        })
        describe('When the only trade taken is one this week, but not today', () => {
            // 22nd April, 2022 (TS month field in constructor is 0-based)
            const today = new Date(2022, 3, 22);
            // Trade take on 16th April, 2022
            const tradeDateStr = '2022-04-19';
            const trades = [
                {
                    pair: 'GBPUSD',
                    action: 'buy',
                    entry_date: tradeDateStr,
                    exit_date: tradeDateStr,
                    risk_reward_ratio: 2.3,
                    profit_loss: 320,
                    pips: 2,
                    notes: '',
                    entry_image_link: '',
                    exit_image_link: '',
                    date_added: '2022-01-02',
                    lots: 2,
                    commissions: 32,
                    swap: 32
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
                thisWeekGraphCalc: [...defaultCalc, {tradeNo: 1, result: trades[0].profit_loss}],
                thisMonthGraphCalc: [...defaultCalc, {tradeNo: 1, result: trades[0].profit_loss}],
                thisYearGraphCalc: [...defaultCalc, {tradeNo: 1, result: trades[0].profit_loss}],
                allTimeGraphCalc: [...defaultCalc, {tradeNo: 1, result: trades[0].profit_loss}]
            }
            test('only today\'s results should be default values', () => {
                    expect(result).toEqual(expectedResult);
            })
        })
        describe('When the only trade taken is one today', () => {
            // 22nd April, 2022 (TS month field in constructor is 0-based)
            const today = new Date(2022, 3, 22);
            // Trade take on 16th April, 2022
            const tradeDateStr = '2022-04-22';
            const trades = [
                {
                    pair: 'GBPUSD',
                    action: 'buy',
                    entry_date: tradeDateStr,
                    exit_date: tradeDateStr,
                    risk_reward_ratio: 2.3,
                    profit_loss: 320,
                    pips: 2,
                    notes: '',
                    entry_image_link: '',
                    exit_image_link: '',
                    date_added: '2022-01-02',
                    lots: 2,
                    commissions: 32,
                    swap: 32
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
                todayGraphCalc: [...defaultCalc, {tradeNo: 1, result: trades[0].profit_loss}],
                thisWeekGraphCalc: [...defaultCalc, {tradeNo: 1, result: trades[0].profit_loss}],
                thisMonthGraphCalc: [...defaultCalc, {tradeNo: 1, result: trades[0].profit_loss}],
                thisYearGraphCalc: [...defaultCalc, {tradeNo: 1, result: trades[0].profit_loss}],
                allTimeGraphCalc: [...defaultCalc, {tradeNo: 1, result: trades[0].profit_loss}]
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
            const todayDateStr = '2022-04-22'
            const thisWeekDateStr = '2022-04-20'
            const thisMonthDateStr = '2022-04-06'
            const thisYearDateStr = '2022-01-13'
            const lastYearDateStr = '2021-06-27'
            const baseTrade = {
                pair: 'GBPUSD',
                action: 'buy',
                risk_reward_ratio: 2.3,
                profit_loss: 320,
                pips: 2,
                notes: '',
                entry_image_link: '',
                exit_image_link: '',
                date_added: '2022-01-02',
                lots: 2,
                commissions: 32,
                swap: 32
            }
            const trades: Trade[] = [
                {
                    ...baseTrade,
                    entry_date: todayDateStr, exit_date: todayDateStr
                },
                {
                    ...baseTrade,
                    entry_date: thisWeekDateStr, exit_date: thisWeekDateStr
                },
                {
                    ...baseTrade,
                    entry_date: thisMonthDateStr, exit_date: thisMonthDateStr
                },
                {
                    ...baseTrade,
                    entry_date: thisYearDateStr, exit_date: thisYearDateStr
                },
                {
                    ...baseTrade,
                    entry_date: lastYearDateStr, exit_date: lastYearDateStr
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
            const expectedTodayCalc = [...defaultCalc, {tradeNo: 1, result: trades[0].profit_loss}];
            const expectedThisWeekCalc = [...expectedTodayCalc, {tradeNo: 2, result: trades[1].profit_loss}]
            const expectedThisMonthCalc = [...expectedThisWeekCalc, {tradeNo: 3, result: trades[2].profit_loss}];
            const expectedThisYearCalc = [...expectedThisMonthCalc, {tradeNo: 4, result: trades[3].profit_loss}]
            const expectedAllTimeCalc = [...expectedThisYearCalc, {tradeNo: 5, result: trades[4].profit_loss}];

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
