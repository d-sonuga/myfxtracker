import BaseText from './base-text'
import {PPropTypes} from './types'

const P = ({children, style, className}: PPropTypes) => {
    return(
        <BaseText 
            variant='body1'
            className={className}
            style={{
                letterSpacing: '0.3px',
                ...style
            }}>{children}</BaseText>
    );
}



export default P