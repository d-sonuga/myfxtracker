import {BP, P} from '@components/text'
import {LongShortData} from './types'


const createRows = (data: LongShortData) => {
    return(
        [
            [<BP>No. of Trades</BP>, <P>{data.long.noOfTrades.toString()}</P>, <P>{data.short.noOfTrades.toString()}</P>],
            [<BP>Result</BP>, <P>{`${data.long.result}`}</P>, <P>{`${data.short.result}`}</P>],
            [<BP>Win Rate</BP>, <P>{`${data.long.winRate}%`}</P>, <P>{`${data.short.winRate}%`}</P>],
            [<BP>Average Profit</BP>, <P>{`$${data.long.aveProfit}`}</P>, <P>{`$${data.short.aveProfit}`}</P>],
            [<BP>RRR</BP>, <P>{data.long.rrr.toString()}</P>, <P>{data.short.rrr.toString()}</P>],
        ]
    )
}

export default createRows