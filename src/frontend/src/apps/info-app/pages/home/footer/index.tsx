import {RowBox, CenterColumnBox} from '@components/containers'
import {SBP} from '@components/text'
import LogoAndSocial from './logo-and-social'
import PagesLinks from './pages-links'
import Contact from './contact'
import './style.css'
import { getDimen } from '@conf/utils'


const Footer = () => {
    return(
        <CenterColumnBox className='apps-info-app-home-footer-container'>
            <RowBox>
                <LogoAndSocial />
                <PagesLinks />
                <Contact />
            </RowBox>
            <SBP style={{marginBottom: getDimen('padding-md')}}>© 2022 myfxtracker.com All rights reserved</SBP>
        </CenterColumnBox>
    );
}

export default Footer