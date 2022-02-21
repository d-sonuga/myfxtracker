import {BP, P} from '@components/text'
import {ExpensesTableCalc} from 'calculator'


const createRows = (calcs: ExpensesTableCalc) => {
    const rows = calcs.map((calc) => ([
        <BP>{calc.pair}</BP>,
        <P>{calc.commission ? calc.commission.toString() : '0'}</P>,
        <P>{calc.swap ? calc.swap.toString() : '0'}</P>
    ]));
    return rows
}

export default createRows