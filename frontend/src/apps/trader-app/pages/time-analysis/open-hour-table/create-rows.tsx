import {P, BP} from '@components/text'
import {OpenHourCalc} from './types'

const createRows = (calcs: Array<OpenHourCalc>) => {
    const rows = calcs.map((calc) => ([
        <BP>{calc.duration}</BP>,
        <P>{calc.noOfTrades.toString()}</P>,
        <P>{`$${calc.result}`}</P>
    ]))
    return rows
}


export default createRows