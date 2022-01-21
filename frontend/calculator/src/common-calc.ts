import {AccountData, Trade} from './types'


const totalNoOfLongs = (data: AccountData | Trade[]) => {
    let noOfLongs = 0;
    if(Array.isArray(data)){
        noOfLongs = noOfLongsFromTradeArray(data);
    } else {
        noOfLongs = noOfLongsFromAccountData(data);
    }
    return noOfLongs;
}

const noOfLongsFromTradeArray = (trades: Trade[]) => {
    let noOfLongs = 0;
    for(const trade of trades){
        if(trade.action === 'buy'){
            noOfLongs += 1;
        }
    }
    return noOfLongs
}

const noOfLongsFromAccountData = (accountData: AccountData) => {
    let noOfLongs = 0;
    for(const trade of accountData.trades){
        if(trade.action === 'buy'){
            noOfLongs += 1;
        }
    }
    return noOfLongs
}

const totalNoOfShorts = (data: AccountData | Trade[]) => {
    let noOfShorts = 0;
    if(Array.isArray(data)){
        noOfShorts = noOfShortsFromTradesArray(data);
    } else {
        noOfShorts = noOfShortsFromAccountData(data);
    }
    return noOfShorts;
}

const noOfShortsFromTradesArray = (trades: Trade[]) => {
    let noOfShorts = 0;
    for(const trade of trades){
        if(trade.action === 'sell'){
            noOfShorts += 1;
        }
    }
    return noOfShorts
}

const noOfShortsFromAccountData = (accountData: AccountData) => {
    let noOfShorts = 0;
    for(const trade of accountData.trades){
        if(trade.action === 'sell'){
            noOfShorts += 1;
        }
    }
    return noOfShorts
}

const totalNoOfLongsWon = (accountData: AccountData) => {
    let noOfLongsWon = 0;
    for(const trade of accountData.trades){
        if(trade.action === 'buy'){
            if(trade.profit_loss > 0){
                noOfLongsWon += 1;
            }
        }
    }
    return noOfLongsWon;
}

const longsWonPercent = (accountData: AccountData) => {
    const noOfLongsWon = totalNoOfLongsWon(accountData);
    const noOfLongs = totalNoOfLongs(accountData);
    if(noOfLongs === 0) return 0
    return (noOfLongsWon / noOfLongs) * 100;
}

const totalNoOfShortsWon = (accountData: AccountData) => {
    let noOfShortsWon = 0;
    for(const trade of accountData.trades){
        if(trade.action === 'sell'){
            if(trade.profit_loss > 0){
                noOfShortsWon += 1;
            }
        }
    }
    return noOfShortsWon;
}

const shortsWonPercent = (accountData: AccountData) => {
    const noOfShortsWon = totalNoOfShortsWon(accountData);
    const noOfShorts = totalNoOfShorts(accountData);
    if(noOfShorts === 0) return 0
    return (noOfShortsWon / noOfShorts) * 100
}


/** Counts the number of profitable trades in account */
const totalNoOfWinningTrades = (data: AccountData | Trade[]) => {
    let totalNoOfWinningTrades = 0;
    if(Array.isArray(data)){
        totalNoOfWinningTrades = totalNoOfWinningTradesFromTradesArray(data);
    } else {
        totalNoOfWinningTrades = totalNoOfWinningTradesFromAccountData(data);
    }
    return totalNoOfWinningTrades
}

const totalNoOfWinningTradesFromAccountData = (accountData: AccountData) => {
    let totalNoOfWinningTrades = 0;
    for(const trade of accountData.trades){
        if(trade.profit_loss > 0){
            totalNoOfWinningTrades += 1;
        }
    }
    return totalNoOfWinningTrades
}

const totalNoOfWinningTradesFromTradesArray = (trades: Trade[]) => {
    let totalNoOfWinningTrades = 0;
    for(const trade of trades){
        if(trade.profit_loss > 0){
            totalNoOfWinningTrades += 1;
        }
    }
    return totalNoOfWinningTrades
}

/** 
 * Calculates winning trades divided by total number of trades
 * expressed as a percentage
 */
 const winRate = (data: AccountData | Trade[]) => {
    const noOfWinningTrades = totalNoOfWinningTrades(data);
    const noOfTradess = noOfTrades(data);
    if(noOfTradess === 0) return 0
    return (noOfWinningTrades / noOfTradess) * 100
}

/** Counts the number of trades in account */
const noOfTrades = (data: AccountData | Trade[]) => {
    if(Array.isArray(data)){
        return data.length
    }
    return data.trades.length
}

export {
    totalNoOfLongs,
    totalNoOfShorts, 
    longsWonPercent,
    shortsWonPercent,
    totalNoOfLongsWon,
    totalNoOfShortsWon,
    totalNoOfWinningTrades,
    winRate,
    noOfTrades
}