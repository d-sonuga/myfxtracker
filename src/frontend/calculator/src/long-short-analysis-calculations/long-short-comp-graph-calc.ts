import {AccountData} from '..'
import {totalLongsProfitLoss, totalShortsProfitLoss} from './common-calc'
import {LongShortComparisonGraphCalc} from './types'


/**
 * Returns an array of 2 items, 1 containing the profit / loss (result)
 * of all longs and the other containing the result of all shorts
 */
const longShortComparisonGraphCalc = (accountData: AccountData) => {
    const calculations: LongShortComparisonGraphCalc = [
        {label: 'long', result: totalLongsProfitLoss(accountData)},
        {label: 'short', result: totalShortsProfitLoss(accountData)}
    ]
    return calculations
}

export default longShortComparisonGraphCalc