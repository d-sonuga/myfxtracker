import {Graph} from '@apps/trader-app/components'
import {objArrayTo2dp} from '@apps/trader-app/utils';
import {LongBalanceGraphCalc} from 'calculator/dist'


const LongBalanceGraph = ({data}: {data: LongBalanceGraphCalc}) => {
    const refinedData = objArrayTo2dp(data, 'result');
    return(
        <Graph
            title='Long Balance'
            data={refinedData}
            xAxisKey='tradeNo'
            yAxisKey='result'
            outline={true}
            headerIsOutside={true}
            data-testid='long-balance-graph'
            />
    );
}

export default LongBalanceGraph