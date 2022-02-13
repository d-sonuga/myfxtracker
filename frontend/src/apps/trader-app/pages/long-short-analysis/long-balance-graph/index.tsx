import {Graph} from '@apps/trader-app/components'
import {LongBalanceGraphCalc} from 'calculator/dist'


const LongBalanceGraph = ({data}: {data: LongBalanceGraphCalc}) => {
    return(
        <Graph
            title='Long Balance'
            data={data}
            xAxisKey='tradeNo'
            yAxisKey='result'
            outline={true}
            headerIsOutside={true}
            />
    );
}

export default LongBalanceGraph