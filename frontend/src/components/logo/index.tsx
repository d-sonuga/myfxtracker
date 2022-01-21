import {Link} from 'react-router-dom'
import {RowBox} from '@components/containers'
import {H5} from '@components/text'
import {getColor, getDimen} from '@conf/utils'
import {ComponentPropTypes} from '@components/types'
import logoImg from '@visuals/images/logo.png'

/**
 * The MyFxTracker logo of the image with the text
 * 
 * @prop className: CSS class name
 * @prop style: sx prop for the underlying MUI component, not CSS inline style
 * 
 */

const Logo = ({className, style}: ComponentPropTypes) => {
    return(
        <Link 
            to='/' 
            className={className}
            style={{
                textDecoration: 'none',
                ...style
                }}>
            <RowBox>
                
                <img 
                    width={30} 
                    height={30} 
                    alt='' 
                    src={logoImg}
                    style={{
                        display: 'inline'
                    }}/>
                <H5 
                    style={{
                        marginLeft: getDimen('padding-xs'),
                        color: getColor('light-blue')
                    }}>MyFxTracker</H5>
                
            </RowBox>
        </Link>
    );
}

export default Logo