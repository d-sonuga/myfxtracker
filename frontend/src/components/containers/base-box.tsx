import {Box} from '@mui/material'
import {ContainerPropTypes} from './types'


const BaseBox = ({children, style, className}: ContainerPropTypes) => {
    return(
        <Box 
            sx={style}
            className={className}>{children}</Box>
    );
}

export default BaseBox
