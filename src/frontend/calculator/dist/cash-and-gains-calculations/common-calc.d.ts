import { AccountData } from "../types";
import { BalanceCalcItem } from './types';
/**
 * @returns an array of objects each of which hold a trade with the balance
 *  at the time the trade was made
 */
declare const balanceCalc: (accountData: AccountData) => BalanceCalcItem[];
export { balanceCalc };
//# sourceMappingURL=common-calc.d.ts.map