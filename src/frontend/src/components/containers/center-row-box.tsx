import BaseBox from './base-box'
import {CenterBoxPropTypes} from './types'


const CenterRowBox = ({children, style, className, alignItemsCenter}: CenterBoxPropTypes) => {
    return(
        <BaseBox
            className={className}
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: alignItemsCenter !== undefined && alignItemsCenter ? 'center' : undefined,
                ...style
            }}>{children}</BaseBox>
    );
}

export default CenterRowBox
