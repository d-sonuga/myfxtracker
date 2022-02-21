import { Trade } from "../types";
declare type ExpensesCalc = {
    expensesTableCalc: ExpensesTableCalc;
};
declare type ExpensesTableCalc = Array<ExpensesTableCalcItem>;
declare type ExpensesTableCalcItem = Pick<Trade, 'pair' | 'commission' | 'swap'>;
export type { ExpensesCalc, ExpensesTableCalc, ExpensesTableCalcItem };
//# sourceMappingURL=types.d.ts.map