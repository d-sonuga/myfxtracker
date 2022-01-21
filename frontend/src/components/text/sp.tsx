import BaseText from './base-text'
import {PPropTypes} from './types'

const SP = ({children, style, className}: PPropTypes) => {
    return(
        <BaseText 
            variant='body2'
            className={className}
            style={style}>{children}</BaseText>
    );
}



export default SP