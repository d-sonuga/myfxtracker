import {ReactNode} from 'react'

const SocialMediaIcon = ({icon, link}: {link: string, icon: ReactNode}) => {
    return( 
        <a 
            href={link}
            style={{color: 'black'}}
            rel='noreferrer'
            target='_blank'>
                {icon}
        </a>
    )
}

export default SocialMediaIcon