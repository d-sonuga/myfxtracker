import {Graph} from '@apps/trader-app/components'
import {objArrayTo2dp} from '@apps/trader-app/utils'
import {ShortBalanceGraphCalc} from 'calculator/dist'


const ShortBalanceGraph = ({data}: {data: ShortBalanceGraphCalc}) => {
    const refinedData = objArrayTo2dp(data, 'result');
    return(
        <Graph
            title='Short Balance'
            data={refinedData}
            xAxisKey='tradeNo'
            yAxisKey='result'
            outline={true}
            headerIsOutside={true}
            data-testid='short-balance-graph'
            />
    );
}

export default ShortBalanceGraph