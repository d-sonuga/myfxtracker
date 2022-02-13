import {Graph} from '@apps/trader-app/components'
import {LongShortComparisonGraphCalc} from 'calculator/dist'


const LongShortBarGraph = ({data}: {data: LongShortComparisonGraphCalc}) => {
    return(
        <div>
            <Graph
                title='Long / Short'
                data={data}
                variant='bar'
                xAxisKey='label'
                yAxisKey='result'
                outline={true}
                headerIsOutside={true}
                headerPaddingTop={0}
                height={270}
                />
        </div>
    )
}

export default LongShortBarGraph