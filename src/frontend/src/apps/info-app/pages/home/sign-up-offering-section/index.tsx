import {useNavigate} from 'react-router'
import {CenterRowBox, CenterColumnBox} from '@components/containers'
import {H5, P} from '@components/text'
import {getColor, getDimen} from '@conf/utils'
import ButtonWithArrow from '../../../components/button-with-arrow'
import './style.css'
import {RouteConst} from '@conf/const'


const SignUpOfferingSection = () => {
    const navigate = useNavigate();
    return(
        <CenterRowBox className='apps-info-app-home-sign-up-offering-container'>
            <CenterColumnBox>
                <H5 style={{marginBottom: getDimen('padding-xs'), textAlign: 'center'}}>
                    100% satisafaction guaranteed
                </H5>
                <P style={{textAlign: 'center', marginBottom: getDimen('padding-xs')}}>
                    We guarantee your satisfaction on MyFxTracker with a full refund.
                    We will refund your subscription fee in full at any month you are dissatisfied.
                </P>
                <ButtonWithArrow 
                    onClick={() => navigate(`/${RouteConst.INFO_SIGN_UP_ROUTE}`)}
                    style={{maxWidth: '350px'}}>
                    Try MyFxTracker free for 7 days
                </ButtonWithArrow>
            </CenterColumnBox>
        </CenterRowBox>
    );
}

export default SignUpOfferingSection