import {AccountData} from '..'
import {CashAndGainsCalculations} from './types'
import cashGraphCalc from './cash-graph-calc'
import gainsGraphCalc from './gains-graph-calc'


const cashAndGainsCalculations = (accountData: AccountData) => {
    const calculations: CashAndGainsCalculations = {
        cashGraphCalc: cashGraphCalc(accountData),
        gainsGraphCalc: gainsGraphCalc(accountData)
    }
    return calculations
}

export default cashAndGainsCalculations