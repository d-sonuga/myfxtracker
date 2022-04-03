import { ColumnBox, RowBox } from '@components/containers';
import { H5, H6, P } from '@components/text'
import { getDimen } from '@conf/utils';
import tick from './tick.png'
import './style.css'


const Features = () => {
    return(
        <ColumnBox>
            <H5 style={{marginBottom: getDimen('padding-xs')}}>Premium Plan</H5>
            <P style={{marginBottom: getDimen('padding-xs')}}>
                Get full access to every single feature that MyFxTracker has to offer.
            </P>
            <RowBox>
                <H6 style={{
                        textTransform: 'uppercase',
                        fontSize: '1rem',
                        marginBottom: getDimen('padding-md'),
                    }}>Here's what you get: &nbsp;</H6>
                <hr className='apps-info-app-pricing-features-divider' />
            </RowBox>
            <div className='apps-info-app-pricing-features-list'>
                <ColumnBox>
                    {leftFeatures.map((feature) => (
                        <FeatureItem feature={feature} />
                    ))}
                </ColumnBox>
                <ColumnBox>
                    {rightFeatures.map((feature) => (
                        <FeatureItem feature={feature} />
                    ))}
                </ColumnBox>
            </div>
        </ColumnBox>
    );
}

const FeatureItem = ({feature}: {feature: string}) => {
    return(
        <RowBox>
            <img src={tick} width='30' height='30' alt='' style={{marginRight: '10px'}} />
            <P style={{marginTop: '3px'}}>{feature}</P>
        </RowBox>
    )
}

const leftFeatures = [
    'Full access to all MyFxTracker stats & charts',
    'Up to 3 Trading Accounts',
    'Accounts Sync',
    'Trading History Import',
    'Filter Trades',
    'Premium client support',
    'Expense Analysis'
]

const rightFeatures = [
    'In-App Notes',
    'Win-rate over time',
    'Cash & Pips tracking',
    'Instrument Analysis',
    'Trading Time Analysis',
    'Period Analysis'
]

export default Features