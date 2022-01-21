import BaseBox from './base-box'
import {ContainerPropTypes} from './types'


const RowBox = ({children, style, className}: ContainerPropTypes) => {
    return(
        <BaseBox
            className={className}
            style={{
                display: 'flex',
                flexDirection: 'row',
                ...style
            }}>{children}</BaseBox>
    );
}

export default RowBox
