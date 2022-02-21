import {P, BP} from '@components/text'
import {OpenHourTableCalc} from 'calculator'

const createRows = (calcs: OpenHourTableCalc) => {
    const rows = calcs.map((calc) => ([
        <BP>{calc.hour}</BP>,
        <P>{calc.noOfTrades.toString()}</P>,
        <P>{calc.result < 0 ? `-$${-1 *calc.result}` : `$${calc.result}`}</P>
    ]))
    return rows
}


export default createRows