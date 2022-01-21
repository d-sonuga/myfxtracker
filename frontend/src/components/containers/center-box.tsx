import BaseBox from './base-box'
import {ContainerPropTypes} from './types'


const Box = ({children, style, className}: ContainerPropTypes) => {
    return(
        <BaseBox
            className={className}
            style={{
                display: 'flex',
                justifyContent: 'center',
                ...style
            }}>{children}</BaseBox>
    );
}

export default Box
