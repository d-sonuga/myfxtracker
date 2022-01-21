import {Table} from '@apps/trader-app/components'
import { getColor } from '@conf/utils';
import createRows from './create-rows'
import {TradeDurationCalc} from './types'


const TradeDurationTable = ({calc}: {calc: Array<TradeDurationCalc>}) => {
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
            />
    )
}

export default TradeDurationTable