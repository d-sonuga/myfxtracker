import {OverviewCardsCalc} from 'calculator'
import {RowBox} from '@components/containers'
import {to2dpString} from '../utils'
import BalanceCard from './balance-card'
import NoOfTradesCard from './no-of-trades-card'
import WinRateCard from './win-rate-card'
import AbsGainCard from './abs-gain-card'
import './style.css'


const OverviewCards = ({calc}: {calc: OverviewCardsCalc}) => {
    const balance = `$${to2dpString(calc.totalBalance)}`;
    const noOfTrades = calc.noOfTrades.toString();
    const winRate = `${to2dpString(calc.winRate)}%`;
    const absGain = `${to2dpString(calc.absGain)}`;

    return(
        <div className='apps-trader-app-pages-overview-overview-cards-container'>
            <BalanceCard balance={balance} />
            <NoOfTradesCard noOfTrades={noOfTrades} />
            <WinRateCard winRate={winRate} />
            <AbsGainCard absGain={absGain} />
        </div>
    )
}

export default OverviewCards