import {PairsAnalysisCalculations, AveReturnsPerPairGraphCalc,
    AveRrrPerPairGraphCalc, PairsAnalysisTableCalc} from 'calculator/dist'


const defaultAveReturnPerPairGraphCalc: AveReturnsPerPairGraphCalc = []
const defaultAveRrrPerPairGraphData: AveRrrPerPairGraphCalc = []
const defaultPairsAnalysisTableCalc: PairsAnalysisTableCalc = []

const defaultPairsAnalysisCalc: PairsAnalysisCalculations = {
    aveReturnsPerPairGraphCalc: defaultAveReturnPerPairGraphCalc,
    aveRrrPerPairGraphCalc: defaultAveRrrPerPairGraphData,
    pairsAnalysisTableCalc: defaultPairsAnalysisTableCalc
}

export {
    defaultPairsAnalysisCalc
}