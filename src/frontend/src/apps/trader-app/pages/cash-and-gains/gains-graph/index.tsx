import {GainsGraphCalc} from 'calculator'
import {Graph} from '@apps/trader-app/components'
import {objObjArrayTo2dp} from '@apps/trader-app/utils';


const GainsGraph = ({data}: {data: GainsGraphCalc}) => {
    const options = objObjArrayTo2dp({
        'Today': data.todayGraphCalc,
        'This Week': data.thisWeekGraphCalc,
        'This Month': data.thisMonthGraphCalc,
        'This Year': data.thisYearGraphCalc,
        'All Time': data.allTimeGraphCalc
    }, 'gainsPercent');
    return(
        <Graph
            title='Gains'
            selectorOptions={options}
            xAxisKey='tradeNo'
            yAxisKey='gainsPercent'
            tooltipName='Gains %'
            outline={true}
            data-testid='gains-graph'
            />
    )
}

export default GainsGraph