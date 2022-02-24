import { Trade } from "../types";
declare type PairsAnalysisCalculations = {
    aveReturnsPerPairGraphCalc: AveReturnsPerPairGraphCalc;
    aveRrrPerPairGraphCalc: AveRrrPerPairGraphCalc;
    pairsAnalysisTableCalc: PairsAnalysisTableCalc;
};
declare type AveReturnsPerPairGraphCalc = Array<{
    pair: string;
    result: number;
}>;
declare type AveRrrPerPairGraphCalc = Array<{
    pair: string;
    rrr: number;
}>;
declare type PairsAnalysisTableCalc = Array<PairsAnalysisTableCalcItem>;
declare type PairsAnalysisTableCalcItem = {
    pair: string;
    noOfTradesOnPair: number;
    noOfProfitableTradesOnPair: number;
    profitableTradesOnPairPercent: number;
    noOfLosingTradesOnPair: number;
    losingTradesOnPairPercent: number;
    noOfShortsOnPair: number;
    shortsOnPairPercent: number;
    noOfLongsOnPair: number;
    longsOnPairPercent: number;
    noOfTpOnPair: number;
    tpOnPairPercent: number;
    noOfSlOnPair: number;
    slOnPairPercent: number;
};
declare type TradesPerPair = {
    [key: string]: Trade[];
};
export type { PairsAnalysisCalculations, AveReturnsPerPairGraphCalc, AveRrrPerPairGraphCalc, PairsAnalysisTableCalc, TradesPerPair };
//# sourceMappingURL=types.d.ts.map