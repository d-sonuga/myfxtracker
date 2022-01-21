import {Graph} from '@apps/trader-app/components'


const LongShortBarGraph = ({data}: {data: Array<{label: string, result: number}>}) => {
    console.log(data);
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