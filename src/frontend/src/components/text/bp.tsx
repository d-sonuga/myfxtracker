import P from './p'
import {PPropTypes} from './types'

const BP = ({children, style, className}: PPropTypes) => {
    return(
        <P
            className={className}
            style={{
            fontWeight: 'fontWeightBold',
            ...style
        }}>{children}</P>
    );
}



export default BP