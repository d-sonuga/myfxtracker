import {Alert} from '@mui/material'
import {ComponentWithChildrenPropTypes} from '@components/types'


const InfoAlert = ({children, style, ...props}: ComponentWithChildrenPropTypes) => {
    return(
        <Alert 
            severity='info'
            sx={style}
            {...props}>{children}</Alert>
    );
}

export default InfoAlert