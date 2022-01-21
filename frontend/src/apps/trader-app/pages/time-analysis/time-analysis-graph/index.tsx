import {Graph} from '@apps/trader-app/components'
import {TimeAnalysisGraphCalc} from 'calculator'


const TimeAnalysisGraph = ({data}: {data: TimeAnalysisGraphCalc}) => {
    const options = {
        'Today': data.todayGraphCalc,
        'This Week': data.thisWeekGraphCalc,
        'This Month': data.thisMonthGraphCalc,
        'This Year': data.thisYearGraphCalc,
        'All Time': data.allTimeGraphCalc
    }
    return(
        <Graph
            title='Open Hour'
            variant='bar'
            xAxisKey='time'
            yAxisKey='result'
            selectorOptions={options}
            outline={true}
            />
    )
}

export default TimeAnalysisGraph