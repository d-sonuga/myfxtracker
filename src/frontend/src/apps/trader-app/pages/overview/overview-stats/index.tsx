import {ReactNode} from 'react'
import {getColor} from '@conf/utils'
import {OverviewStatsCalc} from 'calculator/dist'
import {Table} from '@apps/trader-app/components'
import createRows from './create-rows'


const OverviewStats = ({stats}: {stats: OverviewStatsCalc}) => {
    const rows: Array<Array<ReactNode>> = createRows(stats);
    
    return(
        <div>
            <Table
                title='Statistics'
                rows={rows}
                style={{textAlign: 'left'}}
                bodyColumnConditionalStyle={{
                    condition: (columnIndex) => columnIndex % 2 !== 0,
                    style: {background: getColor('light-gray')}
                }}
                data-testid='overview-stats' />
        </div>
    );
}


export default OverviewStats