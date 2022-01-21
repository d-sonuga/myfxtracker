import {BP, P} from '@components/text'
import {ExpensesCalc} from './types'


const createRows = (calcs: Array<ExpensesCalc>) => {
    const rows = calcs.map((calc) => ([
        <BP>{calc.pair}</BP>,
        <P>{calc.commissions.toString()}</P>,
        <P>{calc.swap.toString()}</P>
    ]));
    return rows
}

export default createRows