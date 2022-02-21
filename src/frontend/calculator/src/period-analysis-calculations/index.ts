import {AccountData} from '@root/types'
import returnsPerPeriodGraphCalc from './returns-per-period-graph-calc'
import {PeriodAnalysisCalculations} from './types'

const periodAnalysisCalculations = (accountData: AccountData) => {
    const calculations: PeriodAnalysisCalculations = {
        returnsPerPeriodGraphCalc: returnsPerPeriodGraphCalc(accountData)
    }
    return calculations
}

export default periodAnalysisCalculations