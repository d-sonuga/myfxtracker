import {useNavigate} from 'react-router'
import {CenterBox, CenterColumnBox} from '@components/containers'
import {H1, P, SBP} from '@components/text'
import {getColor} from '@conf/utils'
import ButtonWithArrow from '@apps/info-app/components/button-with-arrow'
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
                <CenterColumnBox>
                    <ButtonWithArrow onClick={() => navigate('/sign-up')} size='large'>
                        Get 7 days free
                    </ButtonWithArrow>
                    <SBP style={{color: getColor('gray')}}>*No credit card required</SBP>
                </CenterColumnBox>
            </CenterBox>
        </div>
    );
}


export default FirstHeadingSection