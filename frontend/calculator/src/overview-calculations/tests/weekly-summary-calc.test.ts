import weeklySummaryCalc, {getWeekDates} from '../weekly-summary-calc'
import {AccountData, Deposit, Withdrawal, Trade} from '@root/types'

/**
 * Note: the tests are far from complete
 */

describe('Verify that getWeekDates is working', () => {
    const testWhenDayIs = (today: Date, mondayToFriday: Date[]) => {
        const weekDates = getWeekDates(today);
        for(let i=0; i<weekDates.length; i++){
            expect(weekDates[i].getDate()).toEqual(mondayToFriday[i].getDate());
        }
    }
    const testForAllWeekDays = (SUNDAY: Date, MONDAY: Date, TUESDAY: Date, WEDNESDAY: Date,
        THURSDAY: Date, FRIDAY: Date, SATURDAY: Date, mondayToFriday: Date[]) => {
        test('when today is sunday', () => {
            testWhenDayIs(SUNDAY, mondayToFriday);
        });
        test('when today is monday', () => {
            testWhenDayIs(MONDAY, mondayToFriday);
        });
        test('when today is tuesday', () => {
            testWhenDayIs(TUESDAY, mondayToFriday);
        });
        test('when today is wednesday', () => {
            testWhenDayIs(WEDNESDAY, mondayToFriday);
        });
        test('when today is thursday', () => {
            testWhenDayIs(THURSDAY, mondayToFriday);
        });
        test('when today is friday', () => {
            testWhenDayIs(FRIDAY, mondayToFriday);
        });
        test('when today is saturday', () => {
            testWhenDayIs(SATURDAY, mondayToFriday);
        });
    }
    describe('it returns all date objects of 3rd January(Monday) to 7th January(Friday)', () => {
        const YEAR = 2022;
        const JAN = 0;
        // The week days of a week in January 2022
        const SUNDAY = new Date(YEAR, JAN, 2);
        const MONDAY = new Date(YEAR, JAN, 3);
        const TUESDAY = new Date(YEAR, JAN, 4);
        const WEDNESDAY = new Date(YEAR, JAN, 5);
        const THURSDAY = new Date(YEAR, JAN, 6);
        const FRIDAY = new Date(YEAR, JAN, 7);
        const SATURDAY = new Date(YEAR, JAN, 8);

        const mondayToFriday = [
            FRIDAY,
            THURSDAY,
            WEDNESDAY,
            TUESDAY,
            MONDAY
        ];
        testForAllWeekDays(SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, mondayToFriday);
    });
    describe('it returns all date objects of 27th Dec(Monday) to 31st Dec(Friday)', () => {
        const YEAR = 2021;
        const DEC = 11;
        const JAN = 0;
        // The week days of a week in Dec 2021
        const SUNDAY = new Date(YEAR, DEC, 26);
        const MONDAY = new Date(YEAR, DEC, 27);
        const TUESDAY = new Date(YEAR, DEC, 28);
        const WEDNESDAY = new Date(YEAR, DEC, 29);
        const THURSDAY = new Date(YEAR, DEC, 30);
        const FRIDAY = new Date(YEAR, DEC, 31);
        const SATURDAY = new Date(YEAR + 1, JAN, 1);
        
        const mondayToFriday = [
            FRIDAY,
            THURSDAY,
            WEDNESDAY,
            TUESDAY,
            MONDAY
        ];
        testForAllWeekDays(SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, mondayToFriday);
    });
    describe('it returns all date objects of 31st Jan(Monday) to 4th Feb(Friday)', () => {
        const YEAR = 2021;
        const JAN = 0;
        const FEB = 1;
        // The week days of a week in Dec 2021
        const SUNDAY = new Date(YEAR, JAN, 31);
        const MONDAY = new Date(YEAR, FEB, 1);
        const TUESDAY = new Date(YEAR, FEB, 2);
        const WEDNESDAY = new Date(YEAR, FEB, 3);
        const THURSDAY = new Date(YEAR, FEB, 4);
        const FRIDAY = new Date(YEAR, FEB, 5);
        const SATURDAY = new Date(YEAR, FEB, 6);
        
        const mondayToFriday = [
            FRIDAY,
            THURSDAY,
            WEDNESDAY,
            TUESDAY,
            MONDAY
        ];
        testForAllWeekDays(SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, mondayToFriday);
    });
})

describe('Verify that weeklySummaryCalc is working', () => {
    // Deposits and withdrawals are not needed for these tests,
    // because they aren't used to calculate anything for the 
    // account returns graph
    const dummyDeposits: Deposit[] = [];
    const dummyWithdrawals: Withdrawal[] = [];
    const sumArrayObj = (array: {[key: string]: any}[], field: string) => {
        let sum = 0;
        for(const obj of array){
            if(obj[field] !== undefined){
                sum += obj[field];
            }
        }
        return sum
    }
    describe('When no trade in accountData.trades was carried out this week', () => {
        // 21st April, 2022
        const today = new Date(2022, 3, 21);
        // 2nd January, 2021
        const tradeDateStr = '2021-01-02'
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
                stopLoss: 0,
                takeProfit: 0
            },
        ]
        const dummyAccountData: AccountData = {
            name: 'dummy name',
            deposits: dummyDeposits,
            withdrawals: dummyWithdrawals,
            trades
        }
        const result = weeklySummaryCalc(dummyAccountData, today);
        const defaultSummaryResult = {trades: 0, lots: 0, result: 0}
        const expectedResult = {
            '18 Apr': defaultSummaryResult,
            '19 Apr': defaultSummaryResult,
            '20 Apr': defaultSummaryResult,
            '21 Apr': defaultSummaryResult,
            '22 Apr': defaultSummaryResult,
        }
        test('all days of the week have the default summary result', () => {
            expect(result).toEqual(expectedResult);
        })
    })
    describe('When some trades where carried out this week', () => {
        /**
         * @param dateStr: which date should the trades have
         * @param noOfTrades: how many trades should the accountData have
         * @returns: accountData with noOfTrades trades all done on dateStr
         */
        const accountDataWithTradesOnDate = (dateStr: string, noOfTrades: number) => {
            const trades: Trade[] = [];
            for(let i=noOfTrades; i>0; i--){
                trades.push({
                    pair: 'GBPUSD',
                    action: 'buy',
                    openTime: dateStr,
                    closeTime: dateStr,
                    riskRewardRatio: 2.3,
                    profitLoss: 320,
                    pips: 2,
                    notes: '',
                    entryImageLink: '',
                    exitImageLink: '',
                    commission: 32,
                    swap: 32,
                    stopLoss: 0,
                    takeProfit: 0
                })
            }
            return {
                name: 'dummy name',
                deposits: dummyDeposits,
                withdrawals: dummyWithdrawals,
                trades
            }
        }
        describe('Trades only on Monday', () => {
            // Thursday 21st April, 2022
            const today = new Date(2022, 3, 21);
            // Monday 18th April, 2022
            const tradeDateStr = '2022-04-18 18:34:00+00:00'
            // Using the 1st trade set
            const dummyAccountData1: AccountData = accountDataWithTradesOnDate(tradeDateStr, 1);
            // Using the 2nd trade set
            const dummyAccountData2: AccountData = accountDataWithTradesOnDate(tradeDateStr, 17);
            const dummyAccountData3: AccountData = accountDataWithTradesOnDate(tradeDateStr, 232);
            const result1 = weeklySummaryCalc(dummyAccountData1, today);
            const result2 = weeklySummaryCalc(dummyAccountData2, today);
            const result3 = weeklySummaryCalc(dummyAccountData3, today);
            const defaultSummaryResult = {trades: 0, lots: 0, result: 0}
            const baseExpectedResult = {
                '19 Apr': defaultSummaryResult,
                '20 Apr': defaultSummaryResult,
                '21 Apr': defaultSummaryResult,
                '22 Apr': defaultSummaryResult,
            }
            const expectedResult1 = {
                '18 Apr': {trades: dummyAccountData1.trades.length,
                    lots: sumArrayObj(dummyAccountData1.trades, 'lots'),
                    result: sumArrayObj(dummyAccountData1.trades, 'profitLoss')},
                ...baseExpectedResult
            }
            const expectedResult2 = {
                '18 Apr': {trades: dummyAccountData2.trades.length,
                    lots: sumArrayObj(dummyAccountData2.trades, 'lots'),
                    result: sumArrayObj(dummyAccountData2.trades, 'profitLoss')},
                ...baseExpectedResult
            }
            const expectedResult3 = {
                '18 Apr': {trades: dummyAccountData3.trades.length,
                    lots: sumArrayObj(dummyAccountData3.trades, 'lots'),
                    result: sumArrayObj(dummyAccountData3.trades, 'profitLoss')},
                ...baseExpectedResult
            }
            test('all days of the week have the default summary result except Monday', () => {
                expect(result1).toEqual(expectedResult1);
                expect(result2).toEqual(expectedResult2);
                expect(result3).toEqual(expectedResult3);
            })
        })
        describe('Trades only on Tuesday', () => {
            // Thursday 21st April, 2022
            const today = new Date(2022, 3, 21);
            // Tuesday 19th April, 2022
            const tradeDateStr = '2022-04-19 18:34:00+00:00'
            const dummyAccountData1: AccountData = accountDataWithTradesOnDate(tradeDateStr, 1);
            const dummyAccountData2: AccountData = accountDataWithTradesOnDate(tradeDateStr, 17);
            const dummyAccountData3: AccountData = accountDataWithTradesOnDate(tradeDateStr, 232);
            const result1 = weeklySummaryCalc(dummyAccountData1, today);
            const result2 = weeklySummaryCalc(dummyAccountData2, today);
            const result3 = weeklySummaryCalc(dummyAccountData3, today);
            const defaultSummaryResult = {trades: 0, lots: 0, result: 0}
            const baseExpectedResult = {
                '18 Apr': defaultSummaryResult,
                '20 Apr': defaultSummaryResult,
                '21 Apr': defaultSummaryResult,
                '22 Apr': defaultSummaryResult,
            }
            const expectedResult1 = {
                '19 Apr': {trades: dummyAccountData1.trades.length,
                    lots: sumArrayObj(dummyAccountData1.trades, 'lots'),
                    result: sumArrayObj(dummyAccountData1.trades, 'profitLoss')},
                ...baseExpectedResult
            }
            const expectedResult2 = {
                '19 Apr': {trades: dummyAccountData2.trades.length,
                    lots: sumArrayObj(dummyAccountData2.trades, 'lots'),
                    result: sumArrayObj(dummyAccountData2.trades, 'profitLoss')},
                ...baseExpectedResult
            }
            const expectedResult3 = {
                '19 Apr': {trades: dummyAccountData3.trades.length,
                    lots: sumArrayObj(dummyAccountData3.trades, 'lots'),
                    result: sumArrayObj(dummyAccountData3.trades, 'profitLoss')},
                ...baseExpectedResult
            }
            test('all days of the week have the default summary result except Tuesday', () => {
                expect(result1).toEqual(expectedResult1);
                expect(result2).toEqual(expectedResult2);
                expect(result3).toEqual(expectedResult3);
            })
        })
        describe('Trades only on Wednesday', () => {
            // Thursday 21st April, 2022
            const today = new Date(2022, 3, 21);
            // Monday 18th April, 2022, not in today's week
            const tradeDateStr = '2022-04-20 18:34:00+00:00'
            const dummyAccountData1: AccountData = accountDataWithTradesOnDate(tradeDateStr, 1);
            const dummyAccountData2: AccountData = accountDataWithTradesOnDate(tradeDateStr, 17);
            const dummyAccountData3: AccountData = accountDataWithTradesOnDate(tradeDateStr, 232);
            const result1 = weeklySummaryCalc(dummyAccountData1, today);
            const result2 = weeklySummaryCalc(dummyAccountData2, today);
            const result3 = weeklySummaryCalc(dummyAccountData3, today);
            const defaultSummaryResult = {trades: 0, lots: 0, result: 0}
            const baseExpectedResult = {
                '18 Apr': defaultSummaryResult,
                '19 Apr': defaultSummaryResult,
                '21 Apr': defaultSummaryResult,
                '22 Apr': defaultSummaryResult,
            }
            const expectedResult1 = {
                '20 Apr': {trades: dummyAccountData1.trades.length,
                    lots: sumArrayObj(dummyAccountData1.trades, 'lots'),
                    result: sumArrayObj(dummyAccountData1.trades, 'profitLoss')},
                ...baseExpectedResult
            }
            const expectedResult2 = {
                '20 Apr': {trades: dummyAccountData2.trades.length,
                    lots: sumArrayObj(dummyAccountData2.trades, 'lots'),
                    result: sumArrayObj(dummyAccountData2.trades, 'profitLoss')},
                ...baseExpectedResult
            }
            const expectedResult3 = {
                '20 Apr': {trades: dummyAccountData3.trades.length,
                    lots: sumArrayObj(dummyAccountData3.trades, 'lots'),
                    result: sumArrayObj(dummyAccountData3.trades, 'profitLoss')},
                ...baseExpectedResult
            }
            test('all days of the week have the default summary result except Wednesday', () => {
                expect(result1).toEqual(expectedResult1);
                expect(result2).toEqual(expectedResult2);
                expect(result3).toEqual(expectedResult3);
            })
        })
        describe('Trades only on Thursday', () => {
            // Thursday 21st April, 2022
            const today = new Date(2022, 3, 21);
            // Thursday 21st April, 2022
            const tradeDateStr = '2022-04-21 18:34:00+00:00'
            const dummyAccountData1: AccountData = accountDataWithTradesOnDate(tradeDateStr, 1);
            const dummyAccountData2: AccountData = accountDataWithTradesOnDate(tradeDateStr, 17);
            const dummyAccountData3: AccountData = accountDataWithTradesOnDate(tradeDateStr, 232);
            const result1 = weeklySummaryCalc(dummyAccountData1, today);
            const result2 = weeklySummaryCalc(dummyAccountData2, today);
            const result3 = weeklySummaryCalc(dummyAccountData3, today);
            const defaultSummaryResult = {trades: 0, lots: 0, result: 0}
            const baseExpectedResult = {
                '18 Apr': defaultSummaryResult,
                '19 Apr': defaultSummaryResult,
                '20 Apr': defaultSummaryResult,
                '22 Apr': defaultSummaryResult,
            }
            const expectedResult1 = {
                '21 Apr': {trades: dummyAccountData1.trades.length,
                    lots: sumArrayObj(dummyAccountData1.trades, 'lots'),
                    result: sumArrayObj(dummyAccountData1.trades, 'profitLoss')},
                ...baseExpectedResult
            }
            const expectedResult2 = {
                '21 Apr': {trades: dummyAccountData2.trades.length,
                    lots: sumArrayObj(dummyAccountData2.trades, 'lots'),
                    result: sumArrayObj(dummyAccountData2.trades, 'profitLoss')},
                ...baseExpectedResult
            }
            const expectedResult3 = {
                '21 Apr': {trades: dummyAccountData3.trades.length,
                    lots: sumArrayObj(dummyAccountData3.trades, 'lots'),
                    result: sumArrayObj(dummyAccountData3.trades, 'profitLoss')},
                ...baseExpectedResult
            }
            test('all days of the week have the default summary result except Thursday', () => {
                expect(result1).toEqual(expectedResult1);
                expect(result2).toEqual(expectedResult2);
                expect(result3).toEqual(expectedResult3);
            })
        })
        describe('Trades only on Friday', () => {
            // Thursday 21st April, 2022
            const today = new Date(2022, 3, 21);
            // Friday 22nd April, 2022
            const tradeDateStr = '2022-04-22 18:34:00+00:00'
            const dummyAccountData1: AccountData = accountDataWithTradesOnDate(tradeDateStr, 1);
            const dummyAccountData2: AccountData = accountDataWithTradesOnDate(tradeDateStr, 17);
            const dummyAccountData3: AccountData = accountDataWithTradesOnDate(tradeDateStr, 232);
            const result1 = weeklySummaryCalc(dummyAccountData1, today);
            const result2 = weeklySummaryCalc(dummyAccountData2, today);
            const result3 = weeklySummaryCalc(dummyAccountData3, today);
            const defaultSummaryResult = {trades: 0, lots: 0, result: 0}
            const baseExpectedResult = {
                '18 Apr': defaultSummaryResult,
                '19 Apr': defaultSummaryResult,
                '20 Apr': defaultSummaryResult,
                '21 Apr': defaultSummaryResult,
            }
            const expectedResult1 = {
                '22 Apr': {trades: dummyAccountData1.trades.length,
                    lots: sumArrayObj(dummyAccountData1.trades, 'lots'),
                    result: sumArrayObj(dummyAccountData1.trades, 'profitLoss')},
                ...baseExpectedResult
            }
            const expectedResult2 = {
                '22 Apr': {trades: dummyAccountData2.trades.length,
                    lots: sumArrayObj(dummyAccountData2.trades, 'lots'),
                    result: sumArrayObj(dummyAccountData2.trades, 'profitLoss')},
                ...baseExpectedResult
            }
            const expectedResult3 = {
                '22 Apr': {trades: dummyAccountData3.trades.length,
                    lots: sumArrayObj(dummyAccountData3.trades, 'lots'),
                    result: sumArrayObj(dummyAccountData3.trades, 'profitLoss')},
                ...baseExpectedResult
            }
            test('all days of the week have the default summary result except Friday', () => {
                expect(result1).toEqual(expectedResult1);
                expect(result2).toEqual(expectedResult2);
                expect(result3).toEqual(expectedResult3);
            })
        })
    })
})