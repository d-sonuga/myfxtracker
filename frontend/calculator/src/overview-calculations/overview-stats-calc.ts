import {totalNoOfWinningTrades, winRate} from '@root/common-calc'
import {totalNoOfLongs, totalNoOfShorts, longsWonPercent,
    shortsWonPercent, totalNoOfLongsWon, totalNoOfShortsWon} from '../common-calc'
import {OverviewStatsCalc} from './types'
import {AccountData} from '../types'

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

const aveProfit = (accountData: AccountData) => {
    const profit = totalProfit(accountData);
    const noOfWinningTrades = totalNoOfWinningTrades(accountData);
    if(noOfWinningTrades === 0) return 0;
    return profit / noOfWinningTrades;
}

const totalProfit = (accountData: AccountData) => {
    let totalProfit = 0;
    for(const trade of accountData.trades){
        if(trade.profit_loss > 0){
            totalProfit += trade.profit_loss;
        }
    }
    return totalProfit;
}

const aveLoss = (accountData: AccountData) => {
    // Multiplying by -1 to remove the negative sign
    // When displayed, it should be -$loss, not -$-loss
    const loss = totalLoss(accountData) * -1;
    const noOfLosingTrades = totalNoOfLosingTrades(accountData);
    if(noOfLosingTrades === 0) return 0;
    return loss / noOfLosingTrades
}

const totalLoss = (accountData: AccountData) => {
    let totalLoss = 0;
    for(const trade of accountData.trades){
        if(trade.profit_loss < 0){
            totalLoss += trade.profit_loss;
        }
    }
    return totalLoss;
}

const totalNoOfLosingTrades = (accountData: AccountData) => {
    let noOfLosingTrades = 0;
    for(const trade of accountData.trades){
        if(trade.profit_loss < 0){
            noOfLosingTrades += 1;
        }
    }
    return noOfLosingTrades;
}

/** Trade with highest profit */
const bestTrade = (accountData: AccountData) => {
    if(accountData.trades.length === 0) return 0
    let bestTrade = accountData.trades[0].profit_loss;
    for(const trade of accountData.trades){
        if(trade.profit_loss > bestTrade){
            bestTrade = trade.profit_loss;
        }
    }
    return bestTrade;
}

/** Trade with the lowest profit (or loss) */
const worstTrade = (accountData: AccountData) => {
    if(accountData.trades.length === 0) return 0
    let worstTrade = accountData.trades[0].profit_loss;
    for(const trade of accountData.trades){
        if(trade.profit_loss < worstTrade){
            worstTrade = trade.profit_loss;
        }
    }
    return worstTrade;
}

const highestBalance = (accountData: AccountData) => {
    return 0;
}

const aveRRR = (accountData: AccountData) => {
    const profit = aveProfit(accountData);
    const loss = aveLoss(accountData);
    if(profit === 0 && loss === 0) return 0
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
    const winrate = winRate(accountData);
    return (
        (aveProfit(accountData) * winrate) - (aveLoss(accountData) * (100 - winrate))
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
        if(trade.commissions){
            totalCommissions += trade.commissions
        }
    }
    return totalCommissions;
}

export default statsCalc