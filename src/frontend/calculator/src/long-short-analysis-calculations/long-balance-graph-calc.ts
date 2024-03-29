import {AccountData} from '..'
import {LongBalanceGraphCalc} from './types'


/**
 * Profit / loss of longs against an index no in which a trade having an index
 * number 1 implies that it was carried out before a trade with an index number 2
 */
const longBalanceGraphCalc = (accountData: AccountData) => {
    let cummulativeResult = 0;
    const calculations: LongBalanceGraphCalc = [
        {tradeNo: 0, result: 0},
        ...accountData.trades
            .filter((trade) => trade.action === 'buy')
            .map((trade, i) => {
                cummulativeResult += trade.profitLoss;
                return {
                    tradeNo: i + 1,
                    result: cummulativeResult
                }
            })
    ]
    return calculations
}

export default longBalanceGraphCalc