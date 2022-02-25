/**
 * Represents the data associated with a trading account
 * @property name: the name of the account
 * @property trades: an array of trade objects representing all trades
 *  that have been taken on the account
 * @property deposits: an array of deposit objects representing all deposits
 *  that have been deposited in the account
 * @property withdrawals: an array of withdrawal objects representing all
 *  withdrawals from the account
 */
declare type AccountData = {
    name: string;
    trades: Trade[];
    deposits: Deposit[];
    withdrawals: Withdrawal[];
};
declare type Trade = {
    pair: string;
    action: string;
    riskRewardRatio?: number;
    profitLoss: number;
    pips?: number;
    notes?: string;
    entryImageLink?: string;
    exitImageLink?: string;
    lots?: number;
    commission?: number;
    swap?: number;
    openTime: string;
    closeTime: string;
    transactionId?: number;
    stopLoss: number;
    takeProfit: number;
    comment?: string;
    magicNumber?: number;
    openPrice: number;
    closePrice: number;
};
declare type Deposit = {
    account: number;
    amount: number;
    time: string;
};
declare type Withdrawal = {
    account: number;
    amount: number;
    time: string;
};
/**
 * For a graph that shows different views of the same data
 * over different periods: today, this week, this month, this year
 * and all time
 */
declare type PeriodGraph<T> = {
    todayGraphCalc: Array<T>;
    thisWeekGraphCalc: Array<T>;
    thisMonthGraphCalc: Array<T>;
    thisYearGraphCalc: Array<T>;
    allTimeGraphCalc: Array<T>;
};
export type { AccountData, Trade, Deposit, Withdrawal, PeriodGraph };
//# sourceMappingURL=types.d.ts.map