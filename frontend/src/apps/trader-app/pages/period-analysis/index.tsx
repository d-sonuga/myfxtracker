import {useState} from 'react'
import {PeriodAnalysisCalculations, ReturnsPerPeriodGraphCalc, periodAnalysisCalculations} from 'calculator'
import {Graph, PageContainer, PageHeading, useRecalc} from '@apps/trader-app/components'
import defaultPeriodAnalysisCalc from './const'


const PeriodAnalysis = () => {
    const [periodAnalysisCalc, setPeriodAnalysisCalc] = useState<PeriodAnalysisCalculations>(defaultPeriodAnalysisCalc);
    useRecalc(periodAnalysisCalculations, setPeriodAnalysisCalc);
    const returnsPerPeriodGraphCalc: ReturnsPerPeriodGraphCalc = {
        ...periodAnalysisCalc.returnsPerPeriodGraphCalc,
        yearly: periodAnalysisCalc.returnsPerPeriodGraphCalc.yearly.length === 0 ?
            [{year: 0, result: 0}, {year: 0, result: 0}]
            : periodAnalysisCalc.returnsPerPeriodGraphCalc.yearly
    }
    return(
        <PageContainer>
            <PageHeading heading='Period Analysis' />
            <Graph
                title='Returns Per Period'
                variant='bar'
                xAxisKey={{'daily': 'day', 'monthly': 'month', 'yearly': 'year'}}
                yAxisKey='result'
                selectorOptions={returnsPerPeriodGraphCalc}
                outline={true}
                />
        </PageContainer>
    )
}

export default PeriodAnalysis