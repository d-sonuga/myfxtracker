import {formatMoney, formatPercent} from '@apps/trader-app/utils'
import {OverviewCardsCalc} from 'calculator'
import BalanceCard from './balance-card'
import NoOfTradesCard from './no-of-trades-card'
import WinRateCard from './win-rate-card'
import AbsGainCard from './abs-gain-card'
import './style.css'


const OverviewCards = ({calc}: {calc: OverviewCardsCalc}) => {
    const balance = formatMoney(calc.totalBalance);
    const noOfTrades = calc.noOfTrades.toString();
    const winRate = formatPercent(calc.winRate);
    const absGain = formatPercent(calc.absGain);

    return(
        <div className='apps-trader-app-pages-overview-overview-cards-container'
            data-testid='overview-cards'>
            <BalanceCard balance={balance} />
            <NoOfTradesCard noOfTrades={noOfTrades} />
            <WinRateCard winRate={winRate} />
            <AbsGainCard absGain={absGain} />
        </div>
    )
}

export default OverviewCards