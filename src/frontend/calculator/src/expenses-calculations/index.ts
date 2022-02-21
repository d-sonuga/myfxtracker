import {AccountData} from '@root/types'
import expensesTableCalc from './expenses-table-calc'
import {ExpensesCalc} from './types'


const expensesCalculations = (accountData: AccountData) => {
    const calculations: ExpensesCalc = {
        expensesTableCalc: expensesTableCalc(accountData)
    }
    return calculations
}


export default expensesCalculations