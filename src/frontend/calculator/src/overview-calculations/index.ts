import overviewCardsCalc from './overview-cards-calc'
import statsCalc from './overview-stats-calc'
import weeklySummaryCalc from './weekly-summary-calc'
import accountReturnsGraphCalc from './account-returns-graph-calc'
import {OverviewCalculations} from './types'
import {AccountData} from '@root/types'


const overviewCalculations = (accountData: AccountData) => {
    const calculations: OverviewCalculations = {
        cardsCalc: overviewCardsCalc(accountData),
        statsCalc: statsCalc(accountData),
        weeklySummaryCalc: weeklySummaryCalc(accountData),
        accountReturnsGraphCalc: accountReturnsGraphCalc(accountData)
    };
    return calculations;
}


export default overviewCalculations
export {aveRRR} from './overview-stats-calc'