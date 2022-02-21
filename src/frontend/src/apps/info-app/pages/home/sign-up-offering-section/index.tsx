import {useNavigate} from 'react-router'
import {CenterRowBox, CenterColumnBox} from '@components/containers'
import {H5} from '@components/text'
import {getDimen} from '@conf/utils'
import ButtonWithArrow from '../button-with-arrow'
import './style.css'


const SignUpOfferingSection = () => {
    const navigate = useNavigate();
    return(
        <CenterRowBox className='apps-info-app-home-sign-up-offering-container'>
            <CenterColumnBox>
                <H5 style={{marginBottom: getDimen('padding-xs'), textAlign: 'center'}}>Since we're both serious about your trading, let's make it official.</H5>
                <ButtonWithArrow 
                    onClick={() => navigate('/sign-up')}
                    style={{maxWidth: '350px'}}>
                    Try MyFxTracker free for 14 days
                </ButtonWithArrow>
            </CenterColumnBox>
        </CenterRowBox>
    );
}

export default SignUpOfferingSection