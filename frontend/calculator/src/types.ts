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
type AccountData = {
    name: string,
    trades: Trade[],
    deposits: Deposit[],
    withdrawals: Withdrawal[]
}

type Trade = {
    pair: string,
    action: string,
    entry_date: string,
    exit_date: string,
    risk_reward_ratio: number,
    profit_loss: number,
    pips?: number,
    notes?: string,
    entry_image_link?: string,
    exit_image_link?: string,
    date_added: string,
    lots?: number,
    commissions?: number,
    swap?: number
}

type Deposit = {
    account: number,
    amount: number,
    date: string
}

type Withdrawal = {
    account: number,
    amount: number,
    date: string
}

/**
 * For a graph that shows different views of the same data
 * over different periods: today, this week, this month, this year
 * and all time
 */
type PeriodGraph<T> = {
    todayGraphCalc: Array<T>,
    thisWeekGraphCalc: Array<T>,
    thisMonthGraphCalc: Array<T>,
    thisYearGraphCalc: Array<T>,
    allTimeGraphCalc: Array<T>,
}

export type {
    AccountData,
    Trade,
    Deposit,
    Withdrawal,
    PeriodGraph
}