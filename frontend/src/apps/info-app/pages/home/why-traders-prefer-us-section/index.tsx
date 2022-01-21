import {H3, H4} from '@components/text'
import { getDimen } from '@conf/utils'
import ReasonsCards from './reasons-cards'
import SignUpPrompt from './sign-up-prompt'
import './style.css'


const WhyTradersPreferUsSection = () => {
    return(
        <div className='apps-info-app-home-why-traders-prefer-us-container'>
            <H4 style={{textAlign: 'center', marginBottom: getDimen('padding-big')}}>Why do traders prefer us?</H4>
            <div>
                <ReasonsCards />
                <SignUpPrompt />
            </div>
        </div>
    );
}

export default WhyTradersPreferUsSection