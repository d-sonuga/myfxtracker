import {P, BP} from '@components/text'
import {TradeDurationCalc} from './types'

const createRows = (calcs: Array<TradeDurationCalc>) => {
    const rows = calcs.map((calc) => ([
        <BP>{calc.duration}</BP>,
        <P>{calc.noOfTrades.toString()}</P>,
        <P>{calc.result < 0 ? `-$${-1 *calc.result}` : `$${calc.result}`}</P>
    ]))
    return rows
}


export default createRows