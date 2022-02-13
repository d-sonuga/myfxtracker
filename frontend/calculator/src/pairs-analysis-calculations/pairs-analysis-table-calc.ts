import {noOfTrades, totalNoOfLongs, totalNoOfShorts, winRate, totalNoOfWinningTrades} from '@root/common-calc'
import {AccountData, Trade} from '@root/types'
import {groupTradesByPair} from './utils'
import {PairsAnalysisTableCalc, TradesPerPair} from './types'


const pairsAnalysisTableCalc = (accountData: AccountData): PairsAnalysisTableCalc => {
    const tradesPerPair: TradesPerPair = groupTradesByPair(accountData);
    return Object.keys(tradesPerPair).map((pair) => {
        const trades = tradesPerPair[pair];
        return {
            pair,
            noOfTradesOnPair: trades.length,
            noOfProfitableTradesOnPair: totalNoOfWinningTrades(trades),
            profitableTradesOnPairPercent: winRate(trades),
            noOfLosingTradesOnPair: noOfLosingTrades(trades),
            losingTradesOnPairPercent: loseRate(trades),
            noOfShortsOnPair: totalNoOfShorts(trades),
            shortsOnPairPercent: shortsOnPairPercent(trades),
            noOfLongsOnPair: totalNoOfLongs(trades),
            longsOnPairPercent: longsOnPairPercent(trades),
            noOfTpOnPair: noOfTpOnPair(trades),
            tpOnPairPercent: tpOnPairPercent(trades),
            noOfSlOnPair: noOfSlOnPair(trades),
            slOnPairPercent: slOnPairPercent(trades)
        }
    });
}

const longsOnPairPercent = (trades: Trade[]) => {
    const noOfShorts = totalNoOfLongs(trades);
    const totalNoOfTrades = noOfTrades(trades);
    if(totalNoOfTrades === 0) return 0
    return (noOfShorts / totalNoOfTrades) * 100
}

const shortsOnPairPercent = (trades: Trade[]) => {
    const noOfShorts = totalNoOfShorts(trades);
    const totalNoOfTrades = noOfTrades(trades);
    if(totalNoOfTrades === 0) return 0
    return (noOfShorts / totalNoOfTrades) * 100
}

const noOfLosingTrades = (trades: Trade[]) => {
    const lossTrades = trades.filter((trade) => trade.profitLoss < 0);
    return lossTrades.length
}

const loseRate = (trades: Trade[]) => {
    const lossTrades = noOfLosingTrades(trades);
    const totalNoOfTrades = noOfTrades(trades);
    if(totalNoOfTrades === 0) return 0
    return (lossTrades / totalNoOfTrades) * 100
}

const noOfTpOnPair = (trades: Trade[]) => {
    let tpOnPair = 0;
    trades.forEach((trade) => {
        tpOnPair += trade.takeProfit;
    })
    return tpOnPair;
}

const noOfSlOnPair = (trades: Trade[]) => {
    let slOnPair = 0;
    trades.forEach((trade) => {
        slOnPair += trade.stopLoss;
    })
    return slOnPair;
}

const tpOnPairPercent = (trades: Trade[]) => {
    let tpOnPair = 0;
    let count = 0;
    trades.forEach((trade) => {
        tpOnPair += trade.takeProfit;
        count++;
    })
    return tpOnPair / count;
}

const slOnPairPercent = (trades: Trade[]) => {
    let slOnPair = 0;
    let count = 0;
    trades.forEach((trade) => {
        slOnPair += trade.stopLoss;
        count++;
    })
    return slOnPair / count;
}

export default pairsAnalysisTableCalc