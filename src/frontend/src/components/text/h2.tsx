import BaseText from './base-text'
import {HPropTypes} from './types'

const H2 = ({children, style, className}: HPropTypes) => {
    return(
        <BaseText 
            variant='h2'
            className={className}
            style={style}>{children}</BaseText>
    );
}



export default H2