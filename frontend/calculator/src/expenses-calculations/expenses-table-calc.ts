import {AccountData} from '@root/types'
import {ExpensesTableCalc} from './types'


const expensesTableCalc = (accountData: AccountData) => {
    const expensesPerPair: ExpensesPerPair = calcExpensesPerPair(accountData);
    const calculations: ExpensesTableCalc = Object.keys(expensesPerPair).map((pair) => ({
        pair,
        commissions: expensesPerPair[pair].commissions,
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
            trade.commissions !== undefined ? trade.commissions : 0;
        expensesPerPair[trade.pair].swap += 
            trade.swap !== undefined ? trade.swap : 0;
    }
    return expensesPerPair
}

type ExpensesPerPair = {[key: string]: {commissions: number, swap: number}}


export default expensesTableCalc