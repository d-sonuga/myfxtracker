import {useState} from 'react'
import {ExpensesCalc, expensesCalculations} from 'calculator'
import {PageContainer, PageHeading, Table, useRecalc} from '@apps/trader-app/components'
import {getColor} from '@conf/utils'
import createRows from './create-rows'
import defaultExpensesCalc from './const'


const Expenses = () => {
    const [expensesCalc, setExpensesCalc] = useState(defaultExpensesCalc);
    const headers = ['Pair', 'Commissions ($)', 'Swap Fees ($)'];
    const [rows, setRows] = useState(createRows(expensesCalc.expensesTableCalc));
    useRecalc(expensesCalculations, setExpensesCalc, (newExpensesCalc: ExpensesCalc) => {
        setRows(createRows(newExpensesCalc.expensesTableCalc));
    });

    return(
        <PageContainer>
            <PageHeading heading='Expenses' />
            <Table
                headers={headers}
                rows={rows}
                bodyColumnConditionalStyle={{
                    condition: (i) => i === 1,
                    style: {background: getColor('light-gray')}
                }}
                />
        </PageContainer>
    )
}

export default Expenses