import {useState} from 'react'
import {periodAnalysisCalculations} from 'calculator'
import {Graph, PageContainer, PageHeading, useRecalc} from '@apps/trader-app/components'
import defaultPeriodAnalysisCalc from './const'


const PeriodAnalysis = () => {
    const [periodAnalysisCalc, setPeriodAnalysisCalc] = useState(defaultPeriodAnalysisCalc);
    useRecalc(periodAnalysisCalculations, setPeriodAnalysisCalc);
    console.log(periodAnalysisCalc);
    return(
        <PageContainer>
            <PageHeading heading='Period Analysis' />
            <Graph
                title='Returns Per Period'
                variant='bar'
                xAxisKey={{'daily': 'day', 'monthly': 'month', 'yearly': 'year'}}
                yAxisKey='result'
                selectorOptions={periodAnalysisCalc.returnsPerPeriodGraphCalc}
                outline={true}
                />
        </PageContainer>
    )
}

export default PeriodAnalysis