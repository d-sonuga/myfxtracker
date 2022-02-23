import {P, BP} from '@components/text'
import {formatMoney} from '@apps/trader-app/utils'
import {TradeDurationTableCalc} from 'calculator'

const createRows = (calcs: TradeDurationTableCalc) => {
    const rows = calcs.map((calc) => ([
        <BP>{calc.duration}</BP>,
        <P>{calc.noOfTrades.toString()}</P>,
        <P>{formatMoney(calc.result)}</P>
    ]))
    return rows
}


export default createRows