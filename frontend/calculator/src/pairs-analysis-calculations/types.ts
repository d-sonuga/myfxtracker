type PairsAnalysisCalculations = {
    aveReturnsPerPairGraphCalc: AveReturnsPerPairGraphCalc,
    aveRrrPerPairGraphCalc: AveRrrPerPairGraphCalc,
    pairsAnalysisTableCalc: PairsAnalysisTableCalc
}
type AveReturnsPerPairGraphCalc = Array<{pair: string, result: number}>

type AveRrrPerPairGraphCalc = Array<{pair: string, rrr: number}>

type PairsAnalysisTableCalc = Array<PairsAnalysisTableCalcItem>

type PairsAnalysisTableCalcItem = {
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
    noOfSlOnPair: number,
    slOnPairPercent: number
}

export type {
    PairsAnalysisCalculations,
    AveReturnsPerPairGraphCalc,
    AveRrrPerPairGraphCalc,
    PairsAnalysisTableCalc
}