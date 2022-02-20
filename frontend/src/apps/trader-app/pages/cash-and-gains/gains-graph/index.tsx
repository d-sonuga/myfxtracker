import {GainsGraphCalc} from 'calculator'
import {Graph} from '@apps/trader-app/components'
import formatData from './format-data'


const GainsGraph = ({data}: {data: GainsGraphCalc}) => {
    const refinedData = formatData(data);
    const options = {
        'Today': refinedData.todayGraphCalc,
        'This Week': refinedData.thisWeekGraphCalc,
        'This Month': refinedData.thisMonthGraphCalc,
        'This Year': refinedData.thisYearGraphCalc,
        'All Time': refinedData.allTimeGraphCalc
    }
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