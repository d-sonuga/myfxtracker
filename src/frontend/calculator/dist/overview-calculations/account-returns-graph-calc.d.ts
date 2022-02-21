import { AccountData } from '..';
import { OverviewAccountReturnsGraphCalc } from './types';
/**
 * For calculating the datasets for the Account Returns graph
 * on the overview page of the trader app
 */
/**
 * Each item in the object is an array of objects
 * with keys tradeNo and result.
 * tradeNo is the index of a trade in a chronologically ordered
 * array of trades. For example, if trade A is the first trade a user
 * ever made and trade B was made after it, then trade A will have a tradeNo
 * of 0 and trade B will have a tradeNo of 1
 * The result is the profit / loss of that trade.
 * Each field in the calculations object shows different views over the
 * same data, which correspond to different time ranges:
 * today, this week, this month, this year and all time
 */
declare const accountReturnsGraphCalc: (accountData: AccountData, today?: Date) => OverviewAccountReturnsGraphCalc;
export default accountReturnsGraphCalc;
//# sourceMappingURL=account-returns-graph-calc.d.ts.map