import { OverviewStatsCalc } from './types';
import { AccountData } from '../types';
import { Trade } from '..';
declare const statsCalc: (accountData: AccountData) => OverviewStatsCalc;
declare const aveRRR: (data: AccountData | Trade[]) => number;
export default statsCalc;
export { aveRRR };
//# sourceMappingURL=overview-stats-calc.d.ts.map