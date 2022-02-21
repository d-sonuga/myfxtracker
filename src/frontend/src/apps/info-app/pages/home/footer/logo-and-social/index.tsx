import { ColumnBox } from "@components/containers"
import Logo from "@components/logo"
import { BP } from "@components/text"
import SocialMediaIcons from './social-media-icons'
import './style.css'


const LogoAndSocial = () => {
    return(
        <ColumnBox className='apps-info-app-home-footer-logo-and-social-container'>
            <Logo />
            <BP style={{textTransform: 'capitalize', textAlign: 'left'}}>#1 automated trading forex journal</BP>
            <SocialMediaIcons />
        </ColumnBox>
    )
}

export default LogoAndSocial