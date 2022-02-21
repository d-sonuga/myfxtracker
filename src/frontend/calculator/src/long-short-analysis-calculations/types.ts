type LongShortAnalysisCalculations = {
    longShortComparisonTableCalc: LongShortComparisonTableCalc,
    longShortComparisonGraphCalc: LongShortComparisonGraphCalc,
    longBalanceGraphCalc: LongBalanceGraphCalc,
    shortBalanceGraphCalc: ShortBalanceGraphCalc
}

type LongShortComparisonTableCalc = {
    long: {
        noOfTrades: number,
        result: number,
        winRate: number,
        aveProfit: number,
        rrr: number
    },
    short: {
        noOfTrades: number,
        result: number,
        winRate: number,
        aveProfit: number,
        rrr: number
    }
}

type LongShortComparisonGraphCalc = [
    {label: 'long', result: number},
    {label: 'short', result: number}
]

type ShortBalanceGraphCalc = Array<BalanceGraphItem>

type LongBalanceGraphCalc = Array<BalanceGraphItem>

type BalanceGraphItem = {tradeNo: number, result: number}

export type {
    LongShortAnalysisCalculations,
    LongShortComparisonTableCalc,
    LongShortComparisonGraphCalc,
    LongBalanceGraphCalc,
    ShortBalanceGraphCalc
}