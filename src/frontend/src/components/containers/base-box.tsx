import {Box} from '@mui/material'
import {ContainerPropTypes} from './types'


const BaseBox = ({children, style, className, ...props}: ContainerPropTypes) => {
    return(
        <Box 
            sx={style}
            className={className}
            {...props}>{children}</Box>
    );
}

export default BaseBox
