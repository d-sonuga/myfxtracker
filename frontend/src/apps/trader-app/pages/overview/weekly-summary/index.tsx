import {ReactNode} from 'react'
import {OverviewWeeklySummaryCalc} from 'calculator'
import {getColor} from '@conf/utils'
import {Table} from '@apps/trader-app/components'
import createRows from './create-rows'


const WeeklySummary = ({summary}: {summary: OverviewWeeklySummaryCalc}) => {
    const rows: Array<Array<ReactNode>> = createRows(summary);
    const headers: string[] = ['Date', 'Trades', 'Result'];
    return(
        <div>
            <Table
                title='Weekly Summary'
                headers={headers} 
                rows={rows}
                headerStyle={{textAlign: 'center'}}
                bodyColumnConditionalStyle={{
                    condition: (columnIndex) => columnIndex % 2 !== 0 ? true : false,
                    style: {backgroundColor: getColor('light-gray')}
                }}
                data-testid='weekly-summary'
                />
        </div>
    );
}

export default WeeklySummary