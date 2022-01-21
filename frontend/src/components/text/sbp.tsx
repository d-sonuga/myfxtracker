import SP from './sp'
import {PPropTypes} from './types'

const SBP = ({children, style, className}: PPropTypes) => {
    return(
        <SP
            className={className}
            style={{
            fontWeight: 'fontWeightBold',
            ...style
        }}>{children}</SP>
    );
}



export default SBP