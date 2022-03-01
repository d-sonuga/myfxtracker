import {CenterColumnBox, ColumnBox} from '@components/containers'
import {InfoAppNavbar} from '@apps/info-app/components'
import {H4, P} from '@components/text'
import {getDimen} from '@conf/utils'
import Features from './features'
import PriceProposal from './price-proposal'
import './style.css'


const PricingPage = () => {
    return(
        <>
            <InfoAppNavbar />
            <CenterColumnBox className='apps-info-app-pricing-container'>
                <H4 style={{
                        textTransform: 'capitalize',
                        marginBottom: getDimen('padding-md'),
                        textAlign: 'center'
                }}>Pricing</H4>
                <div className='apps-info-app-pricing-container-content'>
                    <Features />
                    <PriceProposal />
                </div>
            </CenterColumnBox>
        </>
    );
}

export default PricingPage