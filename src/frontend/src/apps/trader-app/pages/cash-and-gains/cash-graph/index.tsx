import {CashGraphCalc, CashGraphItem} from 'calculator'
import {Graph} from '@apps/trader-app/components'
import {objObjArrayTo2dp} from '@apps/trader-app/utils'


const CashGraph = ({data}: {data: CashGraphCalc}) => {
    const options = objObjArrayTo2dp({
        'Today': data.todayGraphCalc,
        'This Week': data.thisWeekGraphCalc,
        'This Month': data.thisMonthGraphCalc,
        'This Year': data.thisYearGraphCalc,
        'All Time': data.allTimeGraphCalc
    }, 'balance');
    return(
        <Graph
            title='Cash'
            selectorOptions={options}
            xAxisKey='tradeNo'
            yAxisKey='balance'
            outline={true}
            data-testid='cash-graph'
            />
    )
}



export default CashGraph