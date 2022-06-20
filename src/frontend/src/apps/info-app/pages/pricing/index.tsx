import {CenterColumnBox} from '@components/containers'
import {InfoAppNavbar} from '@apps/info-app/components'
import {H4} from '@components/text'
import {getDimen} from '@conf/utils'
import Features from './features'
import PriceProposal from './price-proposal'
import {PricingPagePropTypes} from './types'
import './style.css'


const PricingPage = ({navbar, subscribeContent, subscribeAction, style}: PricingPagePropTypes) => {
    return(
        <>
            {navbar}
            <CenterColumnBox className='apps-info-app-pricing-container' style={style}>
                <H4 style={{
                        textTransform: 'capitalize',
                        marginBottom: getDimen('padding-md'),
                        textAlign: 'center',
                        ...style
                }}>Pricing</H4>
                <div className='apps-info-app-pricing-container-content'>
                    <Features />
                    <PriceProposal subscribeContent={subscribeContent} subscribeAction={subscribeAction} />
                </div>
            </CenterColumnBox>
        </>
    );
}

export default PricingPage