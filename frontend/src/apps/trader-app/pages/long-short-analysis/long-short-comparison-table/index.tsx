//import {Table as MuiTable, TableContainer, TableHead, TableBody, TableCell, TableRow} from '@mui/material'
import {Table} from'@apps/trader-app/components'
import {BP, P} from '@components/text'
import {getColor} from '@conf/utils'
import {LongShortComparisonTablePropTypes} from './types'
import createRows from './create-rows'

const LongShortComparisonTable = ({data}: LongShortComparisonTablePropTypes) => {
    const headers = ['', 'Long', 'Short'];
    const rows = createRows(data);
    return(
        <div>
            <Table
            title='Long / Short Comparison'
            headers={headers}
            rows={rows}
            headerStyle={{textAlign: 'center'}}
            bodyColumnConditionalStyle={[
                {
                    condition: (columnIndex) => columnIndex === 0,
                    style: {textAlign: 'left'}
                },
                {
                    condition: (columnIndex) => columnIndex === 1,
                    style: {background: getColor('xlight-green')}
                },
                {
                    condition: (columnIndex) => columnIndex === 2,
                    style: {background: getColor('light-red')}
                }
            ]}
            />
        </div>
    )
}

export default LongShortComparisonTable