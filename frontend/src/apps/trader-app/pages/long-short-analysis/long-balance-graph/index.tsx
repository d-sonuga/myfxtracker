import {Graph} from '@apps/trader-app/components'


const LongBalanceGraph = ({data}: {data: Array<{[key: string]: number}>}) => {
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