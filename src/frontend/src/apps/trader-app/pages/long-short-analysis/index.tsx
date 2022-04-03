import {useState} from 'react'
import {longShortAnalysisCalculations} from 'calculator'
import {PageContainer, PageHeading, useRecalc} from '@apps/trader-app/components'
import LongShortComparisonTable from './long-short-comparison-table'
import LongShortBarGraph from './long-short-bar-graph'
import LongBalanceGraph from './long-balance-graph'
import ShortBalanceGraph from './short-balance-graph'
import defaultLongShortAnalysisCalc from './const'
import './style.css'


const LongShortAnalysis = () => {
    const [longShortAnalysisCalc, setLongShortAnalysisCalc] = useState(defaultLongShortAnalysisCalc);
    useRecalc(longShortAnalysisCalculations, setLongShortAnalysisCalc);

    return(
        <PageContainer>
            <PageHeading heading='Long / Short Analysis' />
            <div className='apps-trader-app-pages-long-short-analysis-container'>
                <div>
                    <LongShortComparisonTable data={longShortAnalysisCalc.longShortComparisonTableCalc} />
                    <LongShortBarGraph data={longShortAnalysisCalc.longShortComparisonGraphCalc} />
                </div>
                <div>
                    <LongBalanceGraph data={longShortAnalysisCalc.longBalanceGraphCalc} />
                    <ShortBalanceGraph data={longShortAnalysisCalc.shortBalanceGraphCalc} />
                </div>
            </div>
        </PageContainer>
    )
}

export default LongShortAnalysis