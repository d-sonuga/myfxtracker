type PairsTablePropTypes = {
    calc: Array<PairsTableCalc>
}

type PairsTableCalc = {
    pair: string,
    noOfTradesOnPair: number,
    noOfProfitableTradesOnPair: number,
    profitableTradesOnPairPercent: number,
    noOfLosingTradesOnPair: number,
    losingTradesOnPairPercent: number,
    noOfShortsOnPair: number,
    shortsOnPairPercent: number,
    noOfLongsOnPair: number,
    longsOnPairPercent: number,
    noOfTpOnPair: number,
    tpOnPairPercent: number,
    noOfSlOnPair: number
    slOnPairPercent: number
}

export type {
    PairsTablePropTypes,
    PairsTableCalc
}