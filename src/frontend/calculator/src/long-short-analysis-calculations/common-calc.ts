import {AccountData} from '..'

/**
 * The total profit / loss gotten from all longs (trade.action = 'buy')
 * in accountData.trades
 * */
 const totalLongsProfitLoss = (accountData: AccountData) => {
    let totalProfitLoss = 0;
    for(const trade of accountData.trades){
        if(trade.action === 'buy'){
            totalProfitLoss += trade.profitLoss
        }
    }
    return totalProfitLoss
}

/**
 * The total profit / loss gotten from all longs (trade.action = 'buy')
 * in accountData.trades
 * */
 const totalShortsProfitLoss = (accountData: AccountData) => {
    let totalProfitLoss = 0;
    for(const trade of accountData.trades){
        if(trade.action === 'sell'){
            totalProfitLoss += trade.profitLoss
        }
    }
    return totalProfitLoss
}

export {
    totalLongsProfitLoss,
    totalShortsProfitLoss
}