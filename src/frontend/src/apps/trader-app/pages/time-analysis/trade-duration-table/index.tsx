import {Table} from '@apps/trader-app/components'
import {getColor} from '@conf/utils'
import createRows from './create-rows'
import {TradeDurationTableCalc} from 'calculator'


const TradeDurationTable = ({calc}: {calc: TradeDurationTableCalc}) => {
    const headers = ['Duration', 'Num. of Trades', 'Result'];
    const rows = createRows(calc);
    return(
        <Table
            title='Results By Trade Duration'
            headers={headers}
            rows={rows}
            bodyColumnConditionalStyle={{
                condition: (i) => i === 1,
                style: {background: getColor('light-gray')}
            }}
            data-testid='trade-duration-table'
            />
    )
}

export default TradeDurationTable