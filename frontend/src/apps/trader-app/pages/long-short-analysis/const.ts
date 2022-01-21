import {LongBalanceGraphCalc, LongShortAnalysisCalculations,
    LongShortComparisonGraphCalc, LongShortComparisonTableCalc, ShortBalanceGraphCalc} from 'calculator'

const defaultLongShortComparisonGraphCalc: LongShortComparisonGraphCalc = [
    {label: 'long', result: 0},
    {label: 'short', result: 0}
]

const defaultLongBalanceGraphCalc: LongBalanceGraphCalc = []

const defaultShortBalanceGraphCalc: ShortBalanceGraphCalc = [];

const defaultLongShortComparisonTableCalcItem = {
    noOfTrades: 0,
    result: 0,
    winRate: 0,
    aveProfit: 0,
    rrr: 0
}

const defaultLongShortComparisonTableCalc: LongShortComparisonTableCalc = {
    long: defaultLongShortComparisonTableCalcItem,
    short: defaultLongShortComparisonTableCalcItem
}

const defaultLongShortAnalysisCalc: LongShortAnalysisCalculations = {
    longShortComparisonGraphCalc: defaultLongShortComparisonGraphCalc,
    longBalanceGraphCalc: defaultLongBalanceGraphCalc,
    shortBalanceGraphCalc: defaultShortBalanceGraphCalc,
    longShortComparisonTableCalc: defaultLongShortComparisonTableCalc
}

export default defaultLongShortAnalysisCalc