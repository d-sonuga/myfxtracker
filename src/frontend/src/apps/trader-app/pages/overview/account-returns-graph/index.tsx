import {Graph} from '@apps/trader-app/components'
import { objObjArrayTo2dp } from '@apps/trader-app/utils'
import {OverviewAccountReturnsGraphCalc} from 'calculator'


const AccountReturnsGraph = ({data}: {data: OverviewAccountReturnsGraphCalc}) => {
    const options = objObjArrayTo2dp({
        'Today': data.todayGraphCalc,
        'This Week': data.thisWeekGraphCalc,
        'This Month': data.thisMonthGraphCalc,
        'This Year': data.thisYearGraphCalc,
        'All Time': data.allTimeGraphCalc
    }, 'result');

    return(
        <div style={{width: '100%'}}>
            <Graph
                title='Account Returns'
                xAxisKey='tradeNo'
                yAxisKey='result'
                selectorOptions={options}
                data-testid='account-returns-graph'
                />
        </div>
    )
}


export default AccountReturnsGraph