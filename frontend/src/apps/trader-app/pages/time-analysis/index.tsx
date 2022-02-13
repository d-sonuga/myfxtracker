import {useState} from 'react'
import {PageContainer, PageHeading, useRecalc} from '@apps/trader-app/components'
import {TradingTimeAnalysisCalculations, tradingTimeAnalysisCalculations} from 'calculator'
import TimeAnalysisGraph from './time-analysis-graph'
import TradeDurationTable from './trade-duration-table'
import OpenHourTable from './open-hour-table'
import defaultTradingTimeAnalysisCalc from './const'
import './style.css'


const TimeAnalysis = () => {
    const [
        tradingTimeAnalysisCalc,
        setTradingTimeAnalysisCalc
    ] = useState<TradingTimeAnalysisCalculations>(defaultTradingTimeAnalysisCalc);
    useRecalc(tradingTimeAnalysisCalculations, setTradingTimeAnalysisCalc);

    return(
        <PageContainer>
            <PageHeading heading='Trading Time Analysis' />
            <TimeAnalysisGraph data={tradingTimeAnalysisCalc.timeAnalysisGraphCalc} />
            <div id='apps-trader-app-pages-time-analysis-tables-container'>
                <TradeDurationTable calc={tradingTimeAnalysisCalc.tradeDurationTableCalc} />
                <OpenHourTable calc={tradingTimeAnalysisCalc.openHourTableCalc} />
            </div>
        </PageContainer>
    )
}

export default TimeAnalysis