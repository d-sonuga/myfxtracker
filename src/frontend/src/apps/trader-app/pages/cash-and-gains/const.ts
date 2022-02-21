import {CashAndGainsCalculations, CashGraphCalc, GainsGraphCalc} from 'calculator'

const defaultGraphCalc = {
    todayGraphCalc: [],
    thisWeekGraphCalc: [],
    thisMonthGraphCalc: [],
    thisYearGraphCalc: [],
    allTimeGraphCalc: []
}

const defaultCashGraphCalc: CashGraphCalc = defaultGraphCalc;

const defaultGainsGraphCalc: GainsGraphCalc = defaultGraphCalc;

const defaultCashAndGainsCalc: CashAndGainsCalculations = {
    cashGraphCalc: defaultCashGraphCalc,
    gainsGraphCalc: defaultGainsGraphCalc
}

export default defaultCashAndGainsCalc