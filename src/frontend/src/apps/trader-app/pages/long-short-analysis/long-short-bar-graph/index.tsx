import {Graph} from '@apps/trader-app/components'
import {objArrayTo2dp} from '@apps/trader-app/utils'
import {LongShortComparisonGraphCalc} from 'calculator/dist'


const LongShortBarGraph = ({data}: {data: LongShortComparisonGraphCalc}) => {
    const refinedData = objArrayTo2dp(data, 'result');
    return(
        <div>
            <Graph
                title='Long / Short'
                data={refinedData}
                variant='bar'
                xAxisKey='label'
                yAxisKey='result'
                outline={true}
                headerIsOutside={true}
                headerPaddingTop={0}
                height={270}
                data-testid='long-short-bar-graph'
                />
        </div>
    )
}

export default LongShortBarGraph