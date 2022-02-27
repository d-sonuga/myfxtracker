import { AccountData } from '..';
import { CashGraphCalc } from './types';
/**
 * For calculating the datasets for the Cash Graph on the
 * Cash And Gains page
 */
declare const cashGraphCalc: (accountData: AccountData, today?: Date) => CashGraphCalc;
declare const graphCalc: (accountData: AccountData) => {
    tradeNo: number;
    balance: number;
}[];
export default cashGraphCalc;
export { graphCalc };
//# sourceMappingURL=cash-graph-calc.d.ts.map