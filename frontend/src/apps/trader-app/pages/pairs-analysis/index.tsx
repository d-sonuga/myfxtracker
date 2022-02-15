import {useState} from 'react'
import {PageContainer, PageHeading} from '@apps/trader-app/components'
import AveReturnPerPairGraph from './ave-return-per-pair-graph'
import AveRrrPerPairGraph from './ave-rrr-per-pair-graph'
import PairsTable from './pairs-table'
import {useRecalc} from '@apps/trader-app/components'
import {pairsAnalysisCalculations, PairsAnalysisCalculations} from 'calculator'
import {defaultPairsAnalysisCalc} from './const'



const PairsAnalysis = () => {
    const [pairsAnalysisCalc, setPairsAnalysisCalc] = useState<PairsAnalysisCalculations>(defaultPairsAnalysisCalc);
    useRecalc(pairsAnalysisCalculations, setPairsAnalysisCalc);
    return(
        <PageContainer>
            <PageHeading heading='Pairs Analysis' />
            <PairsTable calc={pairsAnalysisCalc.pairsAnalysisTableCalc} />
            <AveReturnPerPairGraph data={pairsAnalysisCalc.aveReturnsPerPairGraphCalc} />
            <AveRrrPerPairGraph data={pairsAnalysisCalc.aveRrrPerPairGraphCalc} />
        </PageContainer>
    )
}

export default PairsAnalysis