import {to2dpstring} from '@apps/trader-app/utils'
import {BP, P} from '@components/text'
import {ExpensesTableCalc} from 'calculator'


const createRows = (calcs: ExpensesTableCalc) => {
    const rows = calcs.map((calc) => ([
        <BP>{calc.pair}</BP>,
        <P>{to2dpstring(calc.commission ? calc.commission : 0)}</P>,
        <P>{to2dpstring(calc.swap ? calc.swap : 0)}</P>
    ]));
    return rows
}

export default createRows