type PeriodAnalysisCalculations = {
    returnsPerPeriodGraphCalc: ReturnsPerPeriodGraphCalc
}

type ReturnsPerPeriodGraphCalc = {
    daily: DailyReturnsPerPeriodGraphCalc,
    monthly: MonthlyReturnsPerPeriodGraphCalc,
    yearly: YearlyReturnsPerPeriodGraphCalc
}

type DailyReturnsPerPeriodGraphCalc = Array<{day: DayKey, result: number}>

type MonthlyReturnsPerPeriodGraphCalc = Array<{month: MonthKey, result: number}>


type YearlyReturnsPerPeriodGraphCalc = Array<{year: number, result: number}>

type DayKey = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

type MonthKey = 'January' | 'February' | 'March' | 'April' | 'May' | 'June' | 'July' |
    'August' | 'September' | 'October' | 'November' | 'December';

export type {
    PeriodAnalysisCalculations,
    ReturnsPerPeriodGraphCalc,
    DailyReturnsPerPeriodGraphCalc,
    MonthlyReturnsPerPeriodGraphCalc,
    YearlyReturnsPerPeriodGraphCalc,
    DayKey,
    MonthKey
}