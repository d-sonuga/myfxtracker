import {Graph} from '@apps/trader-app/components'
import {ShortBalanceGraphCalc} from 'calculator/dist'


const ShortBalanceGraph = ({data}: {data: ShortBalanceGraphCalc}) => {
    return(
        <Graph
            title='Short Balance'
            data={data}
            xAxisKey='tradeNo'
            yAxisKey='result'
            outline={true}
            headerIsOutside={true}
            />
    );
}

export default ShortBalanceGraph