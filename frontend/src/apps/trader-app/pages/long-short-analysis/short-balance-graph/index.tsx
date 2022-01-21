import {Graph} from '@apps/trader-app/components'


const ShortBalanceGraph = ({data}: {data: Array<{[key: string]: number}>}) => {
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