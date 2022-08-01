import {Link} from 'react-router-dom'
import {RowBox} from '@components/containers'
import {BP} from '@components/text'
import Logo from '@components/logo'
import {getColor, getDimen} from '@conf/utils'
import {BigScreenNavbarPropTypes} from './types'


const BigScreenNavbar = ({links, rightElement, showLogo}: BigScreenNavbarPropTypes) => {
    return(
        <div className='components-navbar-big-screen-navbar'>
            {
                rightElement ?
                    <RowBox 
                        style={{
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                            marginRight: getDimen('padding-xs')}}>
                        <LogoAndLinks links={links} showLogo={showLogo} />
                        {rightElement}
                    </RowBox>
                    : <LogoAndLinks links={links} showLogo={showLogo} />
            }
        </div>
    );
}

const LogoAndLinks = ({links, showLogo}: {links: Array<Array<string>>, showLogo?: boolean}) => {
    return(
        <RowBox>
            {showLogo === undefined || showLogo ? 
                <Logo style={{
                        marginLeft: '10%',
                        marginRight: getDimen('padding-xs')
                    }} /> : null
            }
            <RowBox style={{alignItems: 'center'}}>
                {
                    links.map((linkInfo: Array<string>, i) => (
                        <Link
                            key={i}
                            to={linkInfo[1]}
                            style={{
                                marginLeft: getDimen('padding-xs'),
                                textDecoration: 'none'
                            }}
                            className='components-navbar-link'>
                                <BP style={{
                                    color: getColor('dark-gray'),
                                    textAlign: 'center',
                                    padding: 0
                                }}>{linkInfo[0]}</BP>
                            </Link>
                    ))
                }
            </RowBox>
        </RowBox>
    );
}

export default BigScreenNavbar