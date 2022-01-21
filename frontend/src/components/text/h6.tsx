import BaseText from './base-text'
import {HPropTypes} from './types'

const H6 = ({children, style, className}: HPropTypes) => {
    return(
        <BaseText 
            variant='h6'
            className={className}
            style={style}>{children}</BaseText>
    );
}



export default H6