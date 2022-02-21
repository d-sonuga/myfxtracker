import { AccountData } from '..';
import { LongBalanceGraphCalc } from './types';
/**
 * Profit / loss of longs against an index no in which a trade having an index
 * number 1 implies that it was carried out before a trade with an index number 2
 */
declare const longBalanceGraphCalc: (accountData: AccountData) => LongBalanceGraphCalc;
export default longBalanceGraphCalc;
//# sourceMappingURL=long-balance-graph-calc.d.ts.map