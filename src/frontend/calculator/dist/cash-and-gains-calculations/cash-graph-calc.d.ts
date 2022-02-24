import { AccountData } from '..';
import { CashGraphCalc, CashGraphItem } from './types';
/**
 * For calculating the datasets for the Cash Graph on the
 * Cash And Gains page
 */
declare const cashGraphCalc: (accountData: AccountData, today?: Date) => CashGraphCalc;
/**
 * The tradeNo is the trade index number
 * The balance is plotted against it
 * Initialize a running balance to 0
 * Initialize the tradesIndex, depositsIndex and withdrawalsIndex to 0
 * Iterate through the trades, deposits and withdrawals at the same time
 * Check for the one with the earliest date
 *  If it's the trade, add the trade to the running balance, increment the tradeIndex by 1
 *      and continue to the next iteration
 *  Else If it's the deposit, add the deposit to the running balance, increment the depositsIndex
 *      then check if the trade's date comes before the withdrawal's
 *      If the trade's date comes before the withdrawal's,
 *          add the trade to the running balance and continue to the next iteration
 *      Else If the withdrawal's date comes before the trade's date,
 *          subtract the withdrawal from the running balance and continue to the next iteration
 */
declare const graphCalc: (accountData: AccountData) => CashGraphItem[];
export default cashGraphCalc;
export { graphCalc };
//# sourceMappingURL=cash-graph-calc.d.ts.map