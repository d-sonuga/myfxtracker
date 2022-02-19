import {BP, P} from '@components/text'
import {formatMoney, formatPercent, to2dpstring} from '@apps/trader-app/utils'
import {LongShortComparisonTableCalc} from 'calculator/dist'


const createRows = (data: LongShortComparisonTableCalc) => {
    return(
        [
            [
                <BP>No. of Trades</BP>,
                <P>{data.long.noOfTrades.toString()}</P>,
                <P>{data.short.noOfTrades.toString()}</P>
            ],
            [
                <BP>Result</BP>,
                <P>{formatMoney(data.long.result)}</P>,
                <P>{formatMoney(data.short.result)}</P>
            ],
            [
                <BP>Win Rate</BP>,
                <P>{formatPercent(data.long.winRate)}</P>,
                <P>{formatPercent(data.short.winRate)}</P>
            ],
            [
                <BP>Average Profit</BP>,
                <P>{formatMoney(data.long.aveProfit)}</P>,
                <P>{formatMoney(data.short.aveProfit)}</P>
            ],
            [
                <BP>RRR</BP>,
                <P>{to2dpstring(data.long.rrr)}</P>,
                <P>{to2dpstring(data.short.rrr)}</P>
            ],
        ]
    )
}

export default createRows