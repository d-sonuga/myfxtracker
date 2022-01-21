type ExpensesCalc = {
    expensesTableCalc: ExpensesTableCalc
}

type ExpensesTableCalc = Array<ExpensesTableCalcItem>

type ExpensesTableCalcItem = {
    pair: string,
    commissions: number,
    swap: number
}

export type {
    ExpensesCalc,
    ExpensesTableCalc
}