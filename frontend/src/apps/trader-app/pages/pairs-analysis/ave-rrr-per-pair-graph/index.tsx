import {Graph} from '@apps/trader-app/components'
import {AveRrrPerPairGraphCalc} from 'calculator/dist'


const AveRrrPerPairGraph = ({data}: {data: AveRrrPerPairGraphCalc}) => {
    const graphData: AveRrrPerPairGraphCalc = data.length === 0 ? [{pair: '', rrr: 0}]
        : data
    return(
        <Graph
            title='Average RRR Per Pair'
            variant='bar'
            data={graphData}
            xAxisKey='pair'
            yAxisKey='rrr'
            outline={true}
            headerIsOutside={true}
            />
    )
}

export default AveRrrPerPairGraph