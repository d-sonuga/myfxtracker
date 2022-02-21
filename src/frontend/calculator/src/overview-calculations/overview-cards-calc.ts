/**
 * Functions for calculating the info on the overview cards
 */

import {winRate, noOfTrades} from '@root/common-calc'
import {OverviewCardsCalc} from './types'
import {AccountData} from '..'

const overviewCardsCalc = (accountData: AccountData) => {
    const calculations: OverviewCardsCalc = {
        totalBalance: totalBalance(accountData),
        winRate: winRate(accountData),
        noOfTrades: noOfTrades(accountData),
        absGain: absGain(accountData)
    }
    return calculations;
}

/**
 * To calculate the total balance of the account
 * Adds all profits, losses (always negative), deposits and subtracts withdrawals
 * */
 const totalBalance = (accountData: AccountData) => {
    let totalBalance = totalProfitLoss(accountData) + totalDeposits(accountData)
        - totalWithdrawals(accountData);
    return totalBalance;
}

/** Sums all profit and losses */
const totalProfitLoss = (accountData: AccountData) => {
    let totalProfitLoss = 0;
    for(const trade of accountData.trades){
        totalProfitLoss += trade.profitLoss;
    }
    return totalProfitLoss;
}

/** Sums all deposits */
const totalDeposits = (accountData: AccountData) => {
    let totalDeposits = 0;
    for(const deposit of accountData.deposits){
        totalDeposits += deposit.amount;
    }
    return totalDeposits;
}

/** Sums all withdrawals */
const totalWithdrawals = (accountData: AccountData) => {
    let totalWithdrawals = 0;
    for(let withdrawal of accountData.withdrawals){
        totalWithdrawals += withdrawal.amount;
    }
    return totalWithdrawals;
}


/** 
 * Calculates total profit and loss divided by total deposits
 * expressed as a precentage
 */
const absGain = (accountData: AccountData) => {
    const profitLoss = totalProfitLoss(accountData);
    const deposits = totalDeposits(accountData);
    if(deposits === 0) return 0
    return (profitLoss / deposits) * 100;
}

export default overviewCardsCalc