import {PageContainer, PageHeading} from '@apps/trader-app/components'
import AveReturnPerPairGraph from './ave-return-per-pair-graph'
import AveRrrPerPairGraph from './ave-rrr-per-pair-graph'
import PairsTable from './pairs-table'
import {PairsTableCalc} from './pairs-table/types'


const PairsAnalysis = () => {
    const aveReturnPerPairGraphData = [
        {pair: 'GBPJPY', result: 420},
        {pair: 'EURJPY', result: -147},
        {pair: 'GBPCAD', result: 500},
        {pair: 'GBPUSD', result: -90},
        {pair: 'EURUSD', result: 230},
        {pair: 'GBPZAR', result: 180},
    ]
    const aveRrrPerPairGraphData = [
        {pair: 'GBPJPY', rrr: 4},
        {pair: 'EURJPY', rrr: -2},
        {pair: 'GBPCAD', rrr: 1.3},
        {pair: 'GBPUSD', rrr: -2.7},
        {pair: 'EURUSD', rrr: 3.6},
        {pair: 'GBPZAR', rrr: 1},
    ]
    const pairsAnalysisTableCalc: PairsTableCalc[] = [
        {
            pair: 'GBPJPY',
            noOfTradesOnPair: 25,
            noOfProfitableTradesOnPair: 9,
            profitableTradesOnPairPercent: 36,
            noOfLosingTradesOnPair: 16,
            losingTradesOnPairPercent: 64,
            noOfShortsOnPair: 16,
            shortsOnPairPercent: 36,
            noOfLongsOnPair: 9,
            longsOnPairPercent: 64,
            noOfTpOnPair: 21,
            tpOnPairPercent: 34.21,
            noOfSlOnPair: 23,
            slOnPairPercent: 44.43  
        },
        {
            pair: 'EURUSD',
            noOfTradesOnPair: 25,
            noOfProfitableTradesOnPair: 9,
            profitableTradesOnPairPercent: 36,
            noOfLosingTradesOnPair: 16,
            losingTradesOnPairPercent: 64,
            noOfShortsOnPair: 16,
            shortsOnPairPercent: 36,
            noOfLongsOnPair: 9,
            longsOnPairPercent: 64,
            noOfTpOnPair: 21,
            tpOnPairPercent: 34.21,
            noOfSlOnPair: 23,
            slOnPairPercent: 44.43  
        },
        {
            pair: 'EURJPY',
            noOfTradesOnPair: 25,
            noOfProfitableTradesOnPair: 9,
            profitableTradesOnPairPercent: 36,
            noOfLosingTradesOnPair: 16,
            losingTradesOnPairPercent: 64,
            noOfShortsOnPair: 16,
            shortsOnPairPercent: 36,
            noOfLongsOnPair: 9,
            longsOnPairPercent: 64,
            noOfTpOnPair: 21,
            tpOnPairPercent: 34.21,
            noOfSlOnPair: 23,
            slOnPairPercent: 44.43  
        },
        {
            pair: 'GBPCAD',
            noOfTradesOnPair: 25,
            noOfProfitableTradesOnPair: 9,
            profitableTradesOnPairPercent: 36,
            noOfLosingTradesOnPair: 16,
            losingTradesOnPairPercent: 64,
            noOfShortsOnPair: 16,
            shortsOnPairPercent: 36,
            noOfLongsOnPair: 9,
            longsOnPairPercent: 64,
            noOfTpOnPair: 21,
            tpOnPairPercent: 34.21,
            noOfSlOnPair: 23,
            slOnPairPercent: 44.43  
        },
    ]
    return(
        <PageContainer>
            <PageHeading heading='Pairs Analysis' />
            <PairsTable calc={pairsAnalysisTableCalc} />
            <AveReturnPerPairGraph data={aveReturnPerPairGraphData} />
            <AveRrrPerPairGraph data={aveRrrPerPairGraphData} />
        </PageContainer>
    )
}

export default PairsAnalysis