import {Table} from'@apps/trader-app/components'
import {getColor} from '@conf/utils'
import createRows from './create-rows'
import {LongShortComparisonTableCalc} from 'calculator/dist'

const LongShortComparisonTable = ({data}: {data: LongShortComparisonTableCalc}) => {
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
                data-testid='long-short-comparison-table'
            />
        </div>
    )
}

export default LongShortComparisonTable