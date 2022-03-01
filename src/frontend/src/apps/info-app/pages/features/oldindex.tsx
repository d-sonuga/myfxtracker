import {CenterColumnBox} from '@components/containers'
import {InfoAppNavbar} from '@apps/info-app/components'
import {H4, P} from '@components/text'
import {getDimen} from '@conf/utils'


const FeaturesPage = () => {
    return(
        <div>
            <InfoAppNavbar />
            <CenterColumnBox style={{
                paddingTop: getDimen('padding-xxxbig'),
                paddingBottom: getDimen('padding-big')
            }}>
                <H4 style={{marginBottom: getDimen('padding-md')}}>Features</H4>
                <CenterColumnBox>
                    {features.map((feature: string, i) => (
                        <P key={i}
                            style={{marginBottom: getDimen('padding-xs')}}>● &#9; {feature}</P>
                    ))}
                </CenterColumnBox>
            </CenterColumnBox>
        </div>
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