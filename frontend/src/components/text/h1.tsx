import BaseText from './base-text'
import {HPropTypes} from './types'

const H1 = ({children, style, className}: HPropTypes) => {
    return(
        <BaseText 
            variant='h1'
            className={className}
            style={style}>{children}</BaseText>
    );
}



export default H1