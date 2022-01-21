import BaseText from './base-text'
import {HPropTypes} from './types'

const H4 = ({children, style, className}: HPropTypes) => {
    return(
        <BaseText 
            variant='h4'
            className={className}
            style={style}>{children}</BaseText>
    );
}



export default H4