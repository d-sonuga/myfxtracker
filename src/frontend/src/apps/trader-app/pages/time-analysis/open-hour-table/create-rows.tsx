import {P, BP} from '@components/text'
import {formatMoney} from '@apps/trader-app/utils'
import {OpenHourTableCalc} from 'calculator'


const createRows = (calcs: OpenHourTableCalc) => {
    const rows = calcs.map((calc) => ([
        <BP>{calc.hour}</BP>,
        <P>{calc.noOfTrades.toString()}</P>,
        <P>{formatMoney(calc.result)}</P>
    ]))
    return rows
}


export default createRows