import BaseBox from './base-box'
import {ContainerPropTypes} from './types'


const ColumnBox = ({children, style, className, ...props}: ContainerPropTypes) => {
    return(
        <BaseBox
            className={className}
            style={{
                display: 'flex',
                flexDirection: 'column',
                ...style
            }} {...props}>{children}</BaseBox>
    );
}

export default ColumnBox
