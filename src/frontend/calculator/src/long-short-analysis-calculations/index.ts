import {AccountData} from '..'
import {LongShortAnalysisCalculations} from './types'
import longShortComparisonTableCalc from './long-short-comp-table-calc'
import longShortComparisonGraphCalc from './long-short-comp-graph-calc'
import longBalanceGraphCalc from './long-balance-graph-calc'
import shortBalanceGraphCalc from './short-balance-graph-calc'


const longShortAnalysisCalculations = (accountData: AccountData) => {
    const calculations: LongShortAnalysisCalculations = {
        longShortComparisonTableCalc: longShortComparisonTableCalc(accountData),
        longShortComparisonGraphCalc: longShortComparisonGraphCalc(accountData),
        longBalanceGraphCalc: longBalanceGraphCalc(accountData),
        shortBalanceGraphCalc: shortBalanceGraphCalc(accountData)
    }
    return calculations
}

export default longShortAnalysisCalculations