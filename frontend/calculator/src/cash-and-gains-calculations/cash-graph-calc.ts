import {Deposit, Withdrawal} from '@root/types'
import {cloneObj, sameDay, sameMonth, sameWeek, sameYear, FAR_IN_THE_FUTURE_YEAR} from '@root/utils'
import {AccountData, Trade} from '..'
import {CashGraphCalc, CashGraphItem} from './types'

/**
 * For calculating the datasets for the Cash Graph on the
 * Cash And Gains page
 */
const cashGraphCalc = (accountData: AccountData, today: Date = new Date()) => {
    const calculations: CashGraphCalc = {
        todayGraphCalc: todayGraphCalc(accountData, today),
        thisWeekGraphCalc: thisWeekGraphCalc(accountData, today),
        thisMonthGraphCalc: thisMonthGraphCalc(accountData, today),
        thisYearGraphCalc: thisYearGraphCalc(accountData, today),
        allTimeGraphCalc: allTimeGraphCalc(accountData, today)
    }
    return calculations
}

const todayGraphCalc = (accountData: AccountData, today: Date) => {
    const accData = cloneObj(accountData);
    accData.trades = accData.trades.filter((trade: Trade) => (
        sameDay(trade.exit_date, today)
    ));
    return graphCalc(accData);
}

const thisWeekGraphCalc = (accountData: AccountData, today: Date) => {
    const accData = cloneObj(accountData);
    accData.trades = accData.trades.filter((trade: Trade) => (
        sameWeek(trade.exit_date, today)
    ));
    return graphCalc(accData);
}

const thisMonthGraphCalc = (accountData: AccountData, today: Date) => {
    const accData = cloneObj(accountData);
    accData.trades = accData.trades.filter((trade: Trade) => (
        sameMonth(trade.exit_date, today)
    ));
    return graphCalc(accData);
}

const thisYearGraphCalc = (accountData: AccountData, today: Date) => {
    const accData = cloneObj(accountData);
    accData.trades = accData.trades.filter((trade: Trade) => (
        sameYear(trade.exit_date, today)
    ));
    return graphCalc(accData);
}

const allTimeGraphCalc = (accountData: AccountData, today: Date) => {
    return graphCalc(accountData);
}

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
const graphCalc = (accountData: AccountData) => {
    let tradesIndex = 0;
    let withdrawalsIndex = 0;
    let depositsIndex = 0;
    let currentTradeNo = 1;
    let currentBalance = 0;
    const calc: CashGraphItem[] = [{tradeNo: 0, balance: 0}]
    while(tradesIndex !== accountData.trades.length){
        const currentDeposit = accountData.deposits[depositsIndex];
        const currentWithdrawal = accountData.withdrawals[withdrawalsIndex];
        const currentTrade = accountData.trades[tradesIndex];
        const [depositPos, withdrawalPos, tradePos] = getDatePos(currentDeposit, currentWithdrawal, currentTrade);
        const tradeIsEarliest = () => tradePos === 1;
        const withdrawalIsEarliest = () => withdrawalPos === 1;
        const withdrawalIsSecond = () => withdrawalPos === 2;
        const depositIsEarliest = () => depositPos === 1;
        const depositIsSecond = () => depositPos === 2;
        const addTradeToBalance = () => {
            currentBalance += currentTrade.profit_loss;
            tradesIndex += 1;
        }
        const decreaseWithdrawalFromBalance = () => {
            currentBalance -= currentWithdrawal.amount;
            withdrawalsIndex += 1;
        }
        const addDepositToBalance = () => {
            currentBalance += currentDeposit.amount;
            depositsIndex += 1;
        }
        // Trade is earliest        
        if(tradeIsEarliest()){
            addTradeToBalance();
            // withdrawal on the same day
            if(withdrawalIsEarliest()){
                decreaseWithdrawalFromBalance();
            }
            // deposit on the same day
            if(depositIsEarliest()){
                addDepositToBalance();
            }
        } else if(depositIsEarliest()){
            addDepositToBalance();
            if(withdrawalIsSecond()){
                decreaseWithdrawalFromBalance();
            }
            // At this point, trade can only be the 3rd
            addTradeToBalance();
        } else {
            // At this point, only the withdrawal can be the earliest
            decreaseWithdrawalFromBalance();
            if(depositIsSecond()){
                addDepositToBalance();
            }
            addTradeToBalance();
        }
        calc.push({tradeNo: currentTradeNo, balance: currentBalance});
        currentTradeNo += 1;
    }
    return calc
}

/**
 * Returns a triple with each slot holding the position of the trade, deposit and withdrawal
 * indicating which took place the earliest, second earliest and latest.
 * For example, if the deposit has the earliest date, withdrawal with the second earliest and
 * trade with the latest, what will be returned will look like this:
 * [1, 2, 3], because the deposit is the first earliest, the withdrawal is the second earliest
 * and the trade is the latest.
 * The positions in the triple are arranged in that order: deposits position, withdrawal's
 * position and trade's position 
 * */
const getDatePos = (deposit: Deposit, withdrawal: Withdrawal, trade: Trade) => {
    const depositDate = deposit === undefined ? new Date(FAR_IN_THE_FUTURE_YEAR, 11, 31)
        : new Date(deposit.date);
    const withdrawalDate = withdrawal === undefined ? new Date(FAR_IN_THE_FUTURE_YEAR, 10, 30) 
        : new Date(withdrawal.date);
    const tradeDate = new Date(trade.exit_date);
    const posTriple = [-1, -1, -1];
    // Their indexes in the posTriple
    const DEPOSIT = 0;
    const WITHDRAWAL = 1;
    const TRADE = 2;
    // Their positions
    const UNSET = -1;
    const FIRST = 1;
    const SECOND = 2;
    const THIRD = 3;
    // To check if a slot in the posTriple has already been set
    const posAlreadySet = (pos: number) => pos !== -1
    const tradeDateIsEarliest = () => tradeDate <= depositDate && tradeDate <= withdrawalDate;
    const depositDateIsEarliest = () => depositDate <= tradeDate && depositDate <= withdrawalDate;
    const withdrawalDateIsEarliest = () => withdrawalDate <= tradeDate && withdrawalDate <= depositDate;
    const sameDate = (date1: Date, date2: Date) => date1 === date2
    /**
     * possible positions:
     *  trade, deposit, withdrawal
     *  trade, withdrawal, deposit
     *  deposit, trade, withdrawal
     *  deposit, withdrawal, trade
     *  withdrawal, deposit, trade
     *  withdrawal, trade, deposit
     * There is also a possibility that any of the dates may be the same
     */
    if(tradeDateIsEarliest()){
        posTriple[TRADE] = FIRST;
        posTriple[DEPOSIT] = sameDate(tradeDate, depositDate) ? FIRST : UNSET;
        posTriple[WITHDRAWAL] = sameDate(tradeDate, withdrawalDate) ? FIRST : UNSET;
        // At this point, the positions of deposit and withdrawal don't matter
        // because as long as trade comes first, the only other things that
        // need to be checked are if the deposits and withdrawals have the same position
    } else if(depositDateIsEarliest()){
        posTriple[DEPOSIT] = FIRST;
        posTriple[TRADE] = sameDate(tradeDate, depositDate) ? FIRST : UNSET;
        posTriple[WITHDRAWAL] = sameDate(withdrawalDate, depositDate) ? FIRST : UNSET;
        if(tradeDate <= withdrawalDate){
            /**
             * Checking if the position is already set to consider the scenario
             * where tradeDate is equal to depositDate, and its position is already 1st
             */
            posTriple[TRADE] = posAlreadySet(TRADE) ? posTriple[TRADE] : SECOND;
            /**
             * If withdrawal's position is already set, that means withdrawalDate is
             * equal to depositDate and so, the date is already 1st
             */
            if(sameDate(tradeDate, withdrawalDate)){
                posTriple[WITHDRAWAL] = posAlreadySet(WITHDRAWAL) ? posTriple[WITHDRAWAL] : SECOND;    
            } else {
                /**
                 * If tradeDate comes before withdrawalDate, then it's not possible for
                 * withdrawal's position to have been set. If withdrawal's position was
                 * set, then it must be equal to depositDate, which is the earliest, but
                 * if it was equal to depositDate, then tradeDate could not have come before
                 * it, so the code here would never have been reached
                 */
                posTriple[WITHDRAWAL] = THIRD;
            }
        } else {
            /**
             * At this point, withdrawalDate is sure to be before tradeDate
             */
            posTriple[TRADE] = THIRD;
            posTriple[WITHDRAWAL] = SECOND;
        }
    } else if(withdrawalDateIsEarliest()){
        posTriple[WITHDRAWAL] = FIRST;
        posTriple[TRADE] = sameDate(tradeDate, withdrawalDate) ? FIRST : UNSET;
        posTriple[DEPOSIT] = sameDate(depositDate, withdrawalDate) ? FIRST : UNSET;
        if(tradeDate <= depositDate){
            /**
             * Checking if the position is already set to consider the scenario
             * where tradeDate is equal to withdrawalDate, and its position is already 1st
             */
            posTriple[TRADE] = posAlreadySet(TRADE) ? posTriple[TRADE] : SECOND;
            /**
             * If deposit's position is already set, that means withdrawalDate is
             * equal to depositDate and so, the date is already 1st
             */
            if(sameDate(tradeDate, depositDate)){
                posTriple[DEPOSIT] = posAlreadySet(DEPOSIT) ? posTriple[DEPOSIT] : SECOND;
            } else {
                /**
                 * If tradeDate comes before depositDate, then it's not possible for
                 * deposit's position to have been set. If deposit's position was
                 * set, then it must be equal to withdrawalDate, which is the earliest, but
                 * if it was equal to withdrawalDate, then tradeDate could not have come before
                 * it, so the code here would never have been reached
                 */
                posTriple[DEPOSIT] = THIRD;
            }
        } else {
            /**
             * At this point, depositDate is sure to be before tradeDate
             */
            posTriple[TRADE] = THIRD;
            posTriple[DEPOSIT] = SECOND;
        }
    }
    return posTriple
}

export default cashGraphCalc;