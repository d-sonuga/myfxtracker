import {Graph} from '@apps/trader-app/components'
import {OverviewAccountReturnsGraphCalc} from 'calculator'


const AccountReturnsGraph = ({data}: {data: OverviewAccountReturnsGraphCalc}) => {
    const options = {
        'Today': data.todayGraphCalc,
        'This Week': data.thisWeekGraphCalc,
        'This Month': data.thisMonthGraphCalc,
        'This Year': data.thisYearGraphCalc,
        'All Time': data.allTimeGraphCalc
    }

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