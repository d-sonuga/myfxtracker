import {ReactNode} from 'react'
import {getColor, getDimen} from '@conf/utils'
import {OverviewStatsCalc} from 'calculator/dist'
import {H6} from '@components/text'
//import Table from './table'
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
                }} />
        </div>
    );
}


export default OverviewStats