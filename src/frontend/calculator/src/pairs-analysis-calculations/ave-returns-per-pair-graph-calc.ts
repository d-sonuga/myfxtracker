import {AccountData} from '@root/types'
import {AveReturnsPerPairGraphCalc} from './types'

const aveReturnsPerPairGraphCalc = (accountData: AccountData) => {
    // An object to get all the number of trades and profit / losses
    // for a pair, to calculate the average returns for that pair
    const perPairData: PerPairDataCalc = calcPerPairData(accountData);
    const calculations: AveReturnsPerPairGraphCalc = calcGraphData(perPairData);
    return calculations
}

/**
 * Turn the result from calcPerPairData into an array of AveReturnsPerPairGraphCalcItem
 * objects with a pair and the average returns associated with it
 */
const calcGraphData = (perPairData: PerPairDataCalc) => {
    // No need to check if the tradeNo is 0, because if can't be
    // The fact that the pair appears in this object implies that there must be at
    // least 1 trade that has this pair
    const aveReturns = (pair: string) => perPairData[pair].profitLoss / perPairData[pair].tradeNo
    return Object.keys(perPairData).map((pair) => (
        {pair, result: aveReturns(pair)}
    ));
}

/** 
 * Returns an object to get all the number of trades and profit / losses 
 * for a pair, which will be used to calculate the average returns for that pair
*/
const calcPerPairData = (accountData: AccountData) => {
    const perPairData: PerPairDataCalc = {};
    for(const trade of accountData.trades){
        if(!(trade.pair in perPairData)){
            perPairData[trade.pair] = {tradeNo: 0, profitLoss: 0}
        }
        perPairData[trade.pair].tradeNo += 1;
        perPairData[trade.pair].profitLoss += trade.profitLoss;
    }
    return perPairData
}

type PerPairDataCalc = {[key: string]: {tradeNo: number, profitLoss: number}}

export default aveReturnsPerPairGraphCalc