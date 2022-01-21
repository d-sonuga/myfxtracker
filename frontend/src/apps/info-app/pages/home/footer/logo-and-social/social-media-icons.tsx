import {Link} from 'react-router-dom'
import {RowBox} from '@components/containers'
import Instagram from '@mui/icons-material/Instagram'
import Facebook from '@mui/icons-material/Facebook'
import Telegram from '@mui/icons-material/Telegram'
import SocialMediaIcon from './base-social-media-icon'


const SocialMediaIcons = () => {
    const igLink = 'https://www.instagram.com/official_myfxtracker/';
    const fbLink = 'https://www.facebook.com/Myfxtracker-100907695710948';
    const tgLink = 'https://t.me/myfxtrackerchannel';
    return(
        <RowBox>
            <SocialMediaIcon
                icon={<Instagram fontSize='large' />}
                link={igLink} />
            <SocialMediaIcon
                icon={<Facebook fontSize='large' />}
                link={fbLink} />
            <SocialMediaIcon
                icon={<Telegram fontSize='large' />}
                link={tgLink} />
        </RowBox>
    )
}

export default SocialMediaIcons