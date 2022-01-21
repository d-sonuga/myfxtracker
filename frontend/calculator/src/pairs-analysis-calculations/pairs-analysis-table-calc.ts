import {noOfTrades, totalNoOfLongs, totalNoOfShorts, winRate, totalNoOfWinningTrades} from '@root/common-calc'
import {AccountData, Trade} from '@root/types'
import {PairsAnalysisTableCalc} from './types'


const pairsAnalysisTableCalc = (accountData: AccountData) => {
    const tradesPerPair: TradesPerPair = groupPairsByTrades(accountData);
    const calculations: PairsAnalysisTableCalc = calcTableData(tradesPerPair);
    return calculations;
}

const calcTableData = (tradesPerPair: TradesPerPair) => {
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
            noOfTpOnPair: 0,
            tpOnPairPercent: 0,
            noOfSlOnPair: 0,
            slOnPairPercent: 0
        }
    })
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
    const lossTrades = trades.filter((trade) => trade.profit_loss < 0);
    return lossTrades.length
}

const loseRate = (trades: Trade[]) => {
    const lossTrades = noOfLosingTrades(trades);
    const totalNoOfTrades = noOfTrades(trades);
    if(totalNoOfTrades === 0) return 0
    return (lossTrades / totalNoOfTrades) * 100
}

const groupPairsByTrades = (accountData: AccountData) => {
    const tradesPerPair: TradesPerPair = {};
    for(const trade of accountData.trades){
        if(!(trade.pair in tradesPerPair)){
            tradesPerPair[trade.pair] = [];
        }
        tradesPerPair[trade.pair].push(trade);
    }
    return tradesPerPair
}

type TradesPerPair = {[key: string]: Trade[]}

export default pairsAnalysisTableCalc