import {totalNoOfWinningTrades, winRate} from '@root/common-calc'
import {graphCalc as balanceCalc} from '@root/cash-and-gains-calculations'
import {CashGraphItem} from '@root/cash-and-gains-calculations/types'
import {totalNoOfLongs, totalNoOfShorts, longsWonPercent,
    shortsWonPercent, totalNoOfLongsWon, totalNoOfShortsWon} from '../common-calc'
import {OverviewStatsCalc} from './types'
import {AccountData} from '../types'
import {Trade} from '..'


const statsCalc = (accountData: AccountData) => {
    const calculations: OverviewStatsCalc = {
        aveProfit: aveProfit(accountData),
        aveLoss: aveLoss(accountData),
        longsWonPercent: longsWonPercent(accountData), 
        noOfLongsWon: totalNoOfLongsWon(accountData),
        noOfLongs: totalNoOfLongs(accountData),
        shortsWonPercent: shortsWonPercent(accountData),
        noOfShortsWon: totalNoOfShortsWon(accountData),
        noOfShorts: totalNoOfShorts(accountData),
        bestTrade: bestTrade(accountData),
        worstTrade: worstTrade(accountData),
        highestBalance: highestBalance(accountData),
        aveRRR: aveRRR(accountData),
        profitFactor: profitFactor(accountData),
        expectancy: expectancy(accountData),
        lots: totalLots(accountData),
        commissions: totalCommissions(accountData)
    }
    return calculations;
}

const aveProfit = (accountData: AccountData | Trade[]) => {
    const profit = totalProfit(accountData);
    const noOfWinningTrades = totalNoOfWinningTrades(accountData);
    if(noOfWinningTrades === 0) return 0;
    return profit / noOfWinningTrades;
}

const totalProfit = (data: AccountData | Trade[]) => {
    let totalProfit = 0;
    let trades: Trade[];
    if(Array.isArray(data)){
        trades = data;
    } else {
        trades = data.trades;
    }
    for(const trade of trades){
        if(trade.profitLoss > 0){
            totalProfit += trade.profitLoss;
        }
    }
    return totalProfit;
}

const aveLoss = (data: AccountData | Trade[]) => {
    // Multiplying by -1 to remove the negative sign
    // When displayed, it should be -$loss, not -$-loss
    const loss = totalLoss(data) * -1;
    const noOfLosingTrades = totalNoOfLosingTrades(data);
    if(noOfLosingTrades === 0) return 0;
    return loss / noOfLosingTrades
}

const totalLoss = (data: AccountData | Trade[]) => {
    let totalLoss = 0;
    let trades: Trade[];
    if(Array.isArray(data)){
        trades = data;
    } else {
        trades = data.trades;
    }
    for(const trade of trades){
        if(trade.profitLoss < 0){
            totalLoss += trade.profitLoss;
        }
    }
    return totalLoss;
}

const totalNoOfLosingTrades = (data: AccountData | Trade[]) => {
    let noOfLosingTrades = 0;
    let trades: Trade[];
    if(Array.isArray(data)){
        trades = data;
    } else {
        trades = data.trades
    }
    for(const trade of trades){
        if(trade.profitLoss < 0){
            noOfLosingTrades += 1;
        }
    }
    return noOfLosingTrades;
}

/** Trade with highest profit */
const bestTrade = (accountData: AccountData) => {
    if(accountData.trades.length === 0) return 0
    let bestTrade = accountData.trades[0].profitLoss;
    for(const trade of accountData.trades){
        if(trade.profitLoss > bestTrade){
            bestTrade = trade.profitLoss;
        }
    }
    return bestTrade;
}

/** Trade with the lowest profit (or loss) */
const worstTrade = (accountData: AccountData) => {
    if(accountData.trades.length === 0) return 0
    let worstTrade = accountData.trades[0].profitLoss;
    for(const trade of accountData.trades){
        if(trade.profitLoss < worstTrade){
            worstTrade = trade.profitLoss;
        }
    }
    return worstTrade;
}

const highestBalance = (accountData: AccountData) => {
    const balanceData: CashGraphItem[] = balanceCalc(accountData);
    let highestBalance = -Infinity;
    balanceData.forEach((data) => {
        if(data.balance > highestBalance){
            highestBalance = data.balance;
        }
    })
    return highestBalance
}

const aveRRR = (data: AccountData | Trade[]) => {
    const profit = aveProfit(data);
    const loss = aveLoss(data);
    if(profit === 0 || loss === 0) return 0
    return profit / loss
}

const profitFactor = (accountData: AccountData) => {
    // What should be returned when loss is 0?
    const profit = totalProfit(accountData);
    const loss = totalLoss(accountData);
    if(profit === 0 && loss === 0) return 0
    return profit / loss;
}

const expectancy = (accountData: AccountData) => {
    const winrate = winRate(accountData) / 100;
    return (
        (aveProfit(accountData) * winrate) - (aveLoss(accountData) * (1 - winrate))
    );
}

const totalLots = (accountData: AccountData) => {
    let totalLots = 0;
    for(const trade of accountData.trades){
        if(trade.lots){
            totalLots += trade.lots;
        }
    }
    return totalLots;
}

const totalCommissions = (accountData: AccountData) => {
    let totalCommissions = 0;
    for(const trade of accountData.trades){
        if(trade.swap){
            totalCommissions += trade.swap;
        }
        if(trade.commission){
            totalCommissions += trade.commission
        }
    }
    return totalCommissions;
}

export default statsCalc
export {aveRRR}