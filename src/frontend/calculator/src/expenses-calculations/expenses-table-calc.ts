import {AccountData} from '@root/types'
import {ExpensesTableCalcItem} from '..'
import {ExpensesTableCalc} from './types'


const expensesTableCalc = (accountData: AccountData) => {
    const expensesPerPair: ExpensesPerPair = calcExpensesPerPair(accountData);
    const calculations: ExpensesTableCalc = Object.keys(expensesPerPair)
        .map((pair): ExpensesTableCalcItem => ({
            pair,
            commission: expensesPerPair[pair].commissions,
            swap: expensesPerPair[pair].swap
   }))
    return calculations
}

const calcExpensesPerPair = (accountData: AccountData) => {
    const expensesPerPair: ExpensesPerPair = {}
    for(const trade of accountData.trades){
        if(!(trade.pair in expensesPerPair)){
            expensesPerPair[trade.pair] = {commissions: 0, swap: 0}
        }
        expensesPerPair[trade.pair].commissions += 
            trade.commission !== undefined ? trade.commission : 0;
        expensesPerPair[trade.pair].swap += 
            trade.swap !== undefined ? trade.swap : 0;
    }
    return expensesPerPair
}

type ExpensesPerPair = {[key: string]: {commissions: number, swap: number}}


export default expensesTableCalc