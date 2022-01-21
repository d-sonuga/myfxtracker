import {useState, useContext, useEffect} from 'react'
import {PageContainer, PageHeading, useRecalc} from '@apps/trader-app/components'
import {GlobalDataContext} from '@apps/trader-app'
import {overviewCalculations, OverviewCalculations} from 'calculator'
import {defaultOverviewCalc} from './const'
import OverviewCards from './overview-cards'
import AccountReturnsGraph from './account-returns-graph'
import OverviewStats from './overview-stats'
import WeeklySummary from './weekly-summary'
import './style.css'


const Overview = () => {
    const [overviewCalc, setOverviewCalc] = useState<OverviewCalculations>(defaultOverviewCalc);
    useRecalc(overviewCalculations, setOverviewCalc);

    return(
        <PageContainer>
            <PageHeading heading='Overview' />
            <OverviewCards calc={overviewCalc.cardsCalc} />
            <AccountReturnsGraph data={overviewCalc.accountReturnsGraphCalc} />
            <div id='apps-trader-app-pages-overview-stats-and-weekly-summary-container'>
                <OverviewStats stats={overviewCalc.statsCalc} />
                <WeeklySummary summary={overviewCalc.weeklySummaryCalc} />
            </div>
        </PageContainer>
    )
}

export default Overview