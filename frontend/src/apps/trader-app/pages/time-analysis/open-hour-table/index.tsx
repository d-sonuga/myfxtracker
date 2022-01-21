import {Table} from '@apps/trader-app/components'
import {getColor} from '@conf/utils'
import createRows from './create-rows'
import {OpenHourCalc} from './types'


const OpenHourTable = ({calc}: {calc: Array<OpenHourCalc>}) => {
    const headers = ['Duration', 'Num. of Trades', 'Result'];
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
            />
    )
}

export default OpenHourTable