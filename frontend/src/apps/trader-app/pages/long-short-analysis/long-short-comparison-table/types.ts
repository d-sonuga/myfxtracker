type LongShortComparisonTablePropTypes = {
    data: LongShortData
}

type LongShortData = {
    long: PerTypeData,
    short: PerTypeData
}

type PerTypeData = {
    noOfTrades: number,
    result: number,
    winRate: number,
    aveProfit: number,
    rrr: number
}

export type {
    LongShortComparisonTablePropTypes,
    LongShortData
}