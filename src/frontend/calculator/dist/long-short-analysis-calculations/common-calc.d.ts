import { AccountData } from '..';
/**
 * The total profit / loss gotten from all longs (trade.action = 'buy')
 * in accountData.trades
 * */
declare const totalLongsProfitLoss: (accountData: AccountData) => number;
/**
 * The total profit / loss gotten from all longs (trade.action = 'buy')
 * in accountData.trades
 * */
declare const totalShortsProfitLoss: (accountData: AccountData) => number;
export { totalLongsProfitLoss, totalShortsProfitLoss };
//# sourceMappingURL=common-calc.d.ts.map