import {Graph} from '@apps/trader-app/components'


const AveReturnPerPairGraph = ({data}: {data: Array<{[key: string]: number | string}>}) => {
    return(
        <Graph
            title='Average Return Per Pair'
            variant='bar'
            data={data}
            xAxisKey='pair'
            yAxisKey='result'
            outline={true}
            headerIsOutside={true}
            />
    )
}

export default AveReturnPerPairGraph