import {useNavigate} from 'react-router'
import {CenterBox} from '@components/containers'
import {H1, P} from '@components/text'
import ButtonWithArrow from '../../../components/button-with-arrow'
import firstHeadingSectionStyle from './style'
import './style.css'

const {headerStyle, textStyle} = firstHeadingSectionStyle;

const FirstHeadingSection = () => {
    const navigate = useNavigate();
    
    return(
        <div className='apps-info-app-pages-home-first-heading'>
            <CenterBox className='apps-info-app-pages-home-first-heading-container'>
                <H1 style={headerStyle}>Journaling made easy</H1>
                <CenterBox className='apps-info-app-pages-home-first-heading-p'>
                    <P style={textStyle}>Connect your Metatrader account and use our 
                    advanced analytics to increase your profitability today.</P>
                </CenterBox>
                <CenterBox>
                    <ButtonWithArrow onClick={() => navigate('/sign-up')}>
                        Get 14 days free
                    </ButtonWithArrow>
                </CenterBox>
            </CenterBox>
        </div>
    );
}


export default FirstHeadingSection