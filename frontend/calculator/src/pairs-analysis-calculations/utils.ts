const groupTradesByPair = (accountData: AccountData) => {
    const tradesPerPair: TradesPerPair = {};
    for(const trade of accountData.trades){
        if(!(trade.pair in tradesPerPair)){
            tradesPerPair[trade.pair] = [];
        }
        tradesPerPair[trade.pair].push(trade);
    }
    return tradesPerPair
}


export {
    groupTradesByPair
}