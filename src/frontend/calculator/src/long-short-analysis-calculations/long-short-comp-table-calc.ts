import {AccountData} from '..'
import {longsWonPercent, shortsWonPercent, totalNoOfLongs, totalNoOfShorts} from '../common-calc'
import {totalLongsProfitLoss, totalShortsProfitLoss} from './common-calc'
import {LongShortComparisonTableCalc} from './types'

const longShortComparisonTableCalc = (accountData: AccountData) => {
    const calculations: LongShortComparisonTableCalc = {
        long: {
            noOfTrades: totalNoOfLongs(accountData),
            result: totalLongsProfitLoss(accountData),
            winRate: longsWonPercent(accountData),
            aveProfit: aveLongsProfitLoss(accountData),
            rrr: longsRrr(accountData)
        },
        short: {
            noOfTrades: totalNoOfShorts(accountData),
            result: totalShortsProfitLoss(accountData),
            winRate: shortsWonPercent(accountData),
            aveProfit: aveShortsProfitLoss(accountData),
            rrr: shortsRrr(accountData)
        }
    }
    return calculations
}

const aveLongsProfitLoss = (accountData: AccountData) => {
    const longsProfit = totalLongsProfitLoss(accountData);
    const noOfLongs = totalNoOfLongs(accountData);
    if(noOfLongs === 0) return 0;
    return longsProfit / noOfLongs
}

const aveShortsProfitLoss = (accountData: AccountData) => {
    const shortsProfit = totalShortsProfitLoss(accountData);
    const noOfShorts = totalNoOfShorts(accountData);
    if(noOfShorts === 0) return 0;
    return shortsProfit / noOfShorts
}

/** @todo: calculate the risk reward ratio */
const longsRrr = (accountData: AccountData) => {
    return 0
}

/** @todo: calculate the risk reward ratio */
const shortsRrr = (accountData: AccountData) => {
    return 0
}

export default longShortComparisonTableCalc