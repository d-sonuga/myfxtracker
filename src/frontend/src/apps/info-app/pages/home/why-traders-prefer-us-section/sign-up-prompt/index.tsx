import {useNavigate} from 'react-router'
import {H5, P} from '@components/text'
import ButtonWithArrow from '@apps/info-app/components/button-with-arrow'
import './style.css'


const SignUpPrompt = () => {
    const navigate = useNavigate();
    return(
        <div className='apps-info-app-home-why-traders-prefer-us-sign-up-prompt-container'>
            <H5>Start tracking your performance today!</H5>
            <P>
                Onboarding is hassle free and can be done in as little as 5 minutes
            </P>
            <div>
                <ButtonWithArrow onClick={() => navigate('/sign-up')}>Get 14 days free</ButtonWithArrow>
            </div>
        </div>
    );
}

export default SignUpPrompt