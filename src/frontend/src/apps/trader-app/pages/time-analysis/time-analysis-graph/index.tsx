import {Graph} from '@apps/trader-app/components'
import {objArrayTo2dp} from '@apps/trader-app/utils'
import {TimeAnalysisGraphCalc, TimeAnalysisGraphCalcItem} from 'calculator'


const TimeAnalysisGraph = ({data}: {data: TimeAnalysisGraphCalc}) => {
    const format = (data: TimeAnalysisGraphCalcItem[]) => {
        if(data.length === 0){
            return [{openHour: '', result: 0}]
        }
        return objArrayTo2dp(data, 'result');
    }
    const options = {
        'Today': format(data.todayGraphCalc),
        'This Week': format(data.thisWeekGraphCalc),
        'This Month': format(data.thisMonthGraphCalc),
        'This Year': format(data.thisYearGraphCalc),
        'All Time': format(data.allTimeGraphCalc)
    }
    return(
        <Graph
            title='Open Hour'
            variant='bar'
            xAxisKey='openHour'
            yAxisKey='result'
            selectorOptions={options}
            outline={true}
            data-testid='open-hour-graph'
            />
    )
}

export default TimeAnalysisGraph