import BaseRow from './base-row'
import {ContainerPropTypes} from './types'


const Row = ({children, style, className}: ContainerPropTypes) => {
    return(
        <BaseRow
            style={style}
            className={className}>
            {children}
        </BaseRow>
    );
}

export default Row
