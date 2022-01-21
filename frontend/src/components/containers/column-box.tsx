import BaseBox from './base-box'
import {ContainerPropTypes} from './types'


const ColumnBox = ({children, style, className}: ContainerPropTypes) => {
    return(
        <BaseBox
            className={className}
            style={{
                display: 'flex',
                flexDirection: 'column',
                ...style
            }}>{children}</BaseBox>
    );
}

export default ColumnBox
