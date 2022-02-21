import {Graph} from '@apps/trader-app/components'
import {AveReturnsPerPairGraphCalc} from 'calculator/dist'


const AveReturnPerPairGraph = ({data}: {data: AveReturnsPerPairGraphCalc}) => {
    const graphData: AveReturnsPerPairGraphCalc = data.length === 0 ? [{pair: '', result: 0}]
        : data
    return(
        <Graph
            title='Average Return Per Pair'
            variant='bar'
            data={graphData}
            xAxisKey='pair'
            yAxisKey='result'
            outline={true}
            headerIsOutside={true}
            data-testid='ave-returns-per-pair-graph'
            />
    )
}

export default AveReturnPerPairGraph