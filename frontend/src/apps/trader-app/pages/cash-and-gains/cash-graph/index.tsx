import {CashGraphCalc} from 'calculator'
import {Graph} from '@apps/trader-app/components'


const CashGraph = ({data}: {data: CashGraphCalc}) => {
    const options = {
        'Today': data.todayGraphCalc,
        'This Week': data.thisWeekGraphCalc,
        'This Month': data.thisMonthGraphCalc,
        'This Year': data.thisYearGraphCalc,
        'All Time': data.allTimeGraphCalc
    }
    return(
        <Graph
            title='Cash'
            selectorOptions={options}
            xAxisKey='tradeNo'
            yAxisKey='balance'
            outline={true}
            />
    )
}

export default CashGraph