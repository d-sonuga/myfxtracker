import {Graph} from '@apps/trader-app/components'


const AveRrrPerPairGraph = ({data}: {data: Array<{[key: string]: number | string}>}) => {
    return(
        <Graph
            title='Average RRR Per Pair'
            variant='bar'
            data={data}
            xAxisKey='pair'
            yAxisKey='rrr'
            outline={true}
            headerIsOutside={true}
            />
    )
}

export default AveRrrPerPairGraph