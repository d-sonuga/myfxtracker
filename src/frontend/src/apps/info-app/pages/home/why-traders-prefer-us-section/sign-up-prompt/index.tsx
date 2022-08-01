import {useNavigate} from 'react-router'
import ReactGA from 'react-ga4'
import {H5, P} from '@components/text'
import ButtonWithArrow from '@apps/info-app/components/button-with-arrow'
import './style.css'


const SignUpPrompt = () => {
    const navigate = useNavigate();
    return(
        <div className='apps-info-app-home-why-traders-prefer-us-sign-up-prompt-container'>
            <H5>Start tracking & Boost your performance today!</H5>
            <P>
                Onboarding is hassle free and can be done in less than 5 minutes
            </P>
            <div>
                <ButtonWithArrow
                    onClick={() => {
                        ReactGA.event('call_to_action_sign_up');
                        navigate('/sign-up');
                    }}>
                    Get 7 days free
                </ButtonWithArrow>
            </div>
        </div>
    );
}

export default SignUpPrompt