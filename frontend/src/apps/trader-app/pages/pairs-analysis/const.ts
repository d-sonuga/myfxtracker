import {PairsAnalysisCalculations, AveReturnsPerPairGraphCalc,
    AveRrrPerPairGraphCalc, PairsAnalysisTableCalc} from 'calculator/dist'


const defaultAveReturnPerPairGraphCalc: AveReturnsPerPairGraphCalc = [
    //{pair: 'GBPJPY', result: 420},
]
const defaultAveRrrPerPairGraphData: AveRrrPerPairGraphCalc = [
    //{pair: 'GBPJPY', rrr: 4}
]
const defaultPairsAnalysisTableCalc: PairsAnalysisTableCalc = [
    /*
    {
        pair: '',
        noOfTradesOnPair: 0,
        noOfProfitableTradesOnPair: 0,
        profitableTradesOnPairPercent: 0,
        noOfLosingTradesOnPair: 0,
        losingTradesOnPairPercent: 0,
        noOfShortsOnPair: 0,
        shortsOnPairPercent: 0,
        noOfLongsOnPair: 0,
        longsOnPairPercent: 0,
        noOfTpOnPair: 0,
        tpOnPairPercent: 0,
        noOfSlOnPair: 0,
        slOnPairPercent: 0
    }
    */
]

const defaultPairsAnalysisCalc: PairsAnalysisCalculations = {
    aveReturnsPerPairGraphCalc: defaultAveReturnPerPairGraphCalc,
    aveRrrPerPairGraphCalc: defaultAveRrrPerPairGraphData,
    pairsAnalysisTableCalc: defaultPairsAnalysisTableCalc
}

export {
    defaultPairsAnalysisCalc
}