import {DailyReturnsPerPeriodGraphCalc, MonthlyReturnsPerPeriodGraphCalc,
    PeriodAnalysisCalculations, ReturnsPerPeriodGraphCalc, YearlyReturnsPerPeriodGraphCalc} from 'calculator'


const defaultDailyReturns: DailyReturnsPerPeriodGraphCalc = [
    {day: 'Monday', result: 0},
    {day: 'Tuesday', result: 0},
    {day: 'Wednesday', result: 0},
    {day: 'Thursday', result: 0},
    {day: 'Friday', result: 0}
]

const defaultMonthlyReturns: MonthlyReturnsPerPeriodGraphCalc = [
    {month: 'January', result: 0},
    {month: 'February', result: 0},
    {month: 'March', result: 0},
    {month: 'April', result: 0},
    {month: 'May', result: 0},
    {month: 'June', result: 0},
    {month: 'July', result: 0},
    {month: 'August', result: 0},
    {month: 'September', result: 0},
    {month: 'October', result: 0},
    {month: 'November', result: 0},
    {month: 'December', result: 0},
]

const defaultYearlyReturns: YearlyReturnsPerPeriodGraphCalc = []

const defaultReturnsPerPeriodGraphCalc: ReturnsPerPeriodGraphCalc = {
    daily: defaultDailyReturns,
    monthly: defaultMonthlyReturns,
    yearly: defaultYearlyReturns
}

const defaultPeriodAnalysisCalculations: PeriodAnalysisCalculations = {
    returnsPerPeriodGraphCalc: defaultReturnsPerPeriodGraphCalc
}

export default defaultPeriodAnalysisCalculations