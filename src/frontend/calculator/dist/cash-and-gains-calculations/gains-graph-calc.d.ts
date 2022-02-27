import { AccountData } from '..';
import { GainsGraphCalc } from './types';
/**
 * Gains graph is a graph of cummulative gains percentages against tradeNo
 * gainsPercent is defined as profitLoss / totalDeposits
 * Each item in the object is an array of objects
 * with keys tradeNo and gainsPercent.
 * tradeNo is the index of a trade in a chronologically ordered
 * array of trades. For example, if trade A is the first trade a user
 * ever made and trade B was made after it, then trade A will have a tradeNo
 * of 0 and trade B will have a tradeNo of 1
 * The gainsPercent is the cummulative profit / loss of that trade.
 * That is the gainsPercent is the addition of all the profit profit / losses up to
 * the one with the current tradeNo divided by all the deposits up to the last deposit that happened
 * on or before the trade with the current tradeNo took place
 * Each field in the calculations object shows different views over the
 * same data, which correspond to different time ranges:
 * today, this week, this month, this year and all time
 */
declare const gainsGraphCalc: (accountData: AccountData, today?: Date) => GainsGraphCalc;
export default gainsGraphCalc;
//# sourceMappingURL=gains-graph-calc.d.ts.map