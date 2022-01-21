import BaseText from './base-text'
import {HPropTypes} from './types'

const H3 = ({children, style, className}: HPropTypes) => {
    return(
        <BaseText
            variant='h3' 
            className={className}
            style={style}>{children}</BaseText>
    );
}



export default H3