declare type PeriodAnalysisCalculations = {
    returnsPerPeriodGraphCalc: ReturnsPerPeriodGraphCalc;
};
declare type ReturnsPerPeriodGraphCalc = {
    daily: DailyReturnsPerPeriodGraphCalc;
    monthly: MonthlyReturnsPerPeriodGraphCalc;
    yearly: YearlyReturnsPerPeriodGraphCalc;
};
declare type DailyReturnsPerPeriodGraphCalc = Array<{
    day: DayKey;
    result: number;
}>;
declare type MonthlyReturnsPerPeriodGraphCalc = Array<{
    month: MonthKey;
    result: number;
}>;
declare type YearlyReturnsPerPeriodGraphCalc = Array<{
    year: number;
    result: number;
}>;
declare type DayKey = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
declare type MonthKey = 'January' | 'February' | 'March' | 'April' | 'May' | 'June' | 'July' | 'August' | 'September' | 'October' | 'November' | 'December';
export type { PeriodAnalysisCalculations, ReturnsPerPeriodGraphCalc, DailyReturnsPerPeriodGraphCalc, MonthlyReturnsPerPeriodGraphCalc, YearlyReturnsPerPeriodGraphCalc, DayKey, MonthKey };
//# sourceMappingURL=types.d.ts.map