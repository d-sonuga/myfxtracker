import {AccountData} from '..'
import {ShortBalanceGraphCalc} from './types'


/**
 * Profit / loss of longs against an index no in which a trade having an index
 * number 1 implies that it was carried out before a trade with an index number 2
 */
const shortBalanceGraphCalc = (accountData: AccountData) => {
    const calculations: ShortBalanceGraphCalc = [
        {tradeNo: 0, result: 0},
        ...accountData.trades
            .filter((trade) => trade.action === 'sell')
            .map((trade, i) => (
                {tradeNo: i + 1, result: trade.profit_loss}
            ))
    ]
    return calculations
}

export default shortBalanceGraphCalc