import {Table} from '@apps/trader-app/components'
import {getColor} from '@conf/utils'
import createRows from './create-rows'
import {OpenHourTableCalc} from 'calculator'


const OpenHourTable = ({calc}: {calc: OpenHourTableCalc}) => {
    const headers = ['Open Hour', 'Num. of Trades', 'Result'];
    const rows = createRows(calc);
    return(
        <Table
            title='Results By Open Hour'
            headers={headers}
            rows={rows}
            bodyColumnConditionalStyle={{
                condition: (i) => i === 1,
                style: {background: getColor('light-gray')}
            }}
            data-testid='open-hour-table'
            />
    )
}

export default OpenHourTable