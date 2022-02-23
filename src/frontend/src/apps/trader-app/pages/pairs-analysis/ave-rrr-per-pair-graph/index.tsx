import {Graph} from '@apps/trader-app/components'
import {objArrayTo2dp} from '@apps/trader-app/utils'
import {AveRrrPerPairGraphCalc} from 'calculator'


const AveRrrPerPairGraph = ({data}: {data: AveRrrPerPairGraphCalc}) => {
    const graphData: AveRrrPerPairGraphCalc = data.length === 0 ? [{pair: '', rrr: 0}]
        : objArrayTo2dp(data, 'rrr');
    return(
        <Graph
            title='Average RRR Per Pair'
            variant='bar'
            data={graphData}
            xAxisKey='pair'
            yAxisKey='rrr'
            outline={true}
            headerIsOutside={true}
            data-testid='ave-rrr-per-pair-graph'
            />
    )
}

export default AveRrrPerPairGraph