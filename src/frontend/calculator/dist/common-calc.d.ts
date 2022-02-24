import { AccountData, Trade } from './types';
declare const totalNoOfLongs: (data: AccountData | Trade[]) => number;
declare const totalNoOfShorts: (data: AccountData | Trade[]) => number;
declare const totalNoOfLongsWon: (accountData: AccountData) => number;
declare const longsWonPercent: (accountData: AccountData) => number;
declare const totalNoOfShortsWon: (accountData: AccountData) => number;
declare const shortsWonPercent: (accountData: AccountData) => number;
/** Counts the number of profitable trades in account */
declare const totalNoOfWinningTrades: (data: AccountData | Trade[]) => number;
/**
 * Calculates winning trades divided by total number of trades
 * expressed as a percentage
 */
declare const winRate: (data: AccountData | Trade[]) => number;
/** Counts the number of trades in account */
declare const noOfTrades: (data: AccountData | Trade[]) => number;
export { totalNoOfLongs, totalNoOfShorts, longsWonPercent, shortsWonPercent, totalNoOfLongsWon, totalNoOfShortsWon, totalNoOfWinningTrades, winRate, noOfTrades };
//# sourceMappingURL=common-calc.d.ts.map