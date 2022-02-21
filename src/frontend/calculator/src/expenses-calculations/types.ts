import {Trade} from '@root/types'

type ExpensesCalc = {
    expensesTableCalc: ExpensesTableCalc
}

type ExpensesTableCalc = Array<ExpensesTableCalcItem>

type ExpensesTableCalcItem = Pick<Trade, 'pair' | 'commission' | 'swap'>

export type {
    ExpensesCalc,
    ExpensesTableCalc,
    ExpensesTableCalcItem
}