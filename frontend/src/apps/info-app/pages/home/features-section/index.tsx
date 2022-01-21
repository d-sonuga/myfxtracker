import {CenterBox} from '@components/containers'
import {H4, H6} from '@components/text'
import AutomatedJournalCard from './automated-journal-card'
import AnyBrokerCard from './any-broker-card'
import UnlimitedAccountsCard from './unlimited-accounts-card'
import featuresSectionStyle from './style'
import './style.css'

const {futureOfTradingHeaderStyle, secondHeaderStyle} = featuresSectionStyle

const FeaturesSection = () => {
    return(
        <div className='apps-info-app-home-features-section-container'>
            <CenterBox>
                <H6 style={futureOfTradingHeaderStyle}>this is the future of trading</H6>
            </CenterBox>
            <CenterBox>
                <H4 style={secondHeaderStyle}>The easiest place to track & analyse your trading accounts</H4>
            </CenterBox>
            <div className='apps-info-app-home-features-section-feature-cards'>
                <AutomatedJournalCard />
                <AnyBrokerCard />
                <UnlimitedAccountsCard />
            </div>
        </div>
    );
}

export default FeaturesSection