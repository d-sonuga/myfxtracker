import {CenterColumnBox} from '@components/containers'
import {InfoAppNavbar} from '@apps/info-app/components'
import {H4} from '@components/text'


const PricingPage = () => {
    return(
        <div>
            <InfoAppNavbar />
            <CenterColumnBox style={{paddingTop: '150px'}}>
                <H4>Pricing</H4>
            </CenterColumnBox>
        </div>
    );
}

export default PricingPage