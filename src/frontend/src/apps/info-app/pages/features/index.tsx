import {CenterColumnBox, ColumnBox} from '@components/containers'
import {InfoAppNavbar} from '@apps/info-app/components'
import {H4, P} from '@components/text'
import {getDimen} from '@conf/utils'
import PriceProposal from './price-proposal'
import './style.css'


const FeaturesPage = () => {
    return(
        <>
            <InfoAppNavbar />
            <div className='apps-info-app-pricing-content-container'>
                <PriceProposal />
            </div>
        </>
    );
}

const features = [
    'Full access to all MyFxTracker stats & charts',
    'Unlimited Trading Accounts',
    'Accounts Sync',
    'Trading History Import',
    'Filter Trades',
    'Premium client support',
    'In-App Notes',
    'Win-rate over time',
    'Cash & Pips tracking',
    'Instrument Analysis',
    'Trading Time Analysis',
    'Period Analysis',
    'Expense Analysis'
]

export default FeaturesPage