import {getColor} from '@conf/utils'
import {CircularProgress} from '@mui/material'
import {LoadingIconPropTypes} from './types'


const LoadingIcon = ({color, style, size, ...props}: LoadingIconPropTypes) => {
    return(
        <CircularProgress
            size={size ? size : 30}
            sx={{
                color: color ? color : getColor('white'),
                ...style
            }} {...props} />
    )
}

export default LoadingIcon