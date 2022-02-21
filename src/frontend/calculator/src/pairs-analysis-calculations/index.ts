import {AccountData} from '@root/types'
import aveReturnsPerPairGraphCalc from './ave-returns-per-pair-graph-calc'
import aveRrrPerPairGraphCalc from './ave-rrr-per-pair-graph-calc'
import pairsAnalysisTableCalc from './pairs-analysis-table-calc'
import {PairsAnalysisCalculations} from './types'


const pairsAnalysisCalculations = (accountData: AccountData) => {
    const calculations: PairsAnalysisCalculations = {
        aveReturnsPerPairGraphCalc: aveReturnsPerPairGraphCalc(accountData),
        aveRrrPerPairGraphCalc: aveRrrPerPairGraphCalc(accountData),
        pairsAnalysisTableCalc: pairsAnalysisTableCalc(accountData)
    }
    return calculations
}

export default pairsAnalysisCalculations