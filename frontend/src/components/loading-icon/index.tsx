import {CircularProgress} from '@mui/material'
import {LoadingIconPropTypes} from './types'


const LoadingIcon = ({color, style, ...props}: LoadingIconPropTypes) => {
    return(
        <CircularProgress sx={{
            color,
            ...style
        }} {...props} />
    )
}

export default LoadingIcon