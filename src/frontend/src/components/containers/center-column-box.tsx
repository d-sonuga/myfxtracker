import BaseBox from './base-box'
import {CenterBoxPropTypes} from './types'


const CenterColumnBox = ({children, style, className, alignItemsCenter}: CenterBoxPropTypes) => {
    return(
        <BaseBox
            className={className}
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: alignItemsCenter === undefined || alignItemsCenter ? 'center' : undefined,
                ...style
            }}>{children}</BaseBox>
    );
}

export default CenterColumnBox
