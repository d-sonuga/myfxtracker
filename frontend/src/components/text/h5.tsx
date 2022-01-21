import BaseText from './base-text'
import {HPropTypes} from './types'

const H5 = ({children, style, className}: HPropTypes) => {
    return(
        <BaseText 
            variant='h5'
            className={className}
            style={style}>{children}</BaseText>
    );
}



export default H5