import {Alert} from '@mui/material'
import {ComponentWithChildrenPropTypes} from '@components/types'


const ErrorAlert = ({children, style, ...props}: ComponentWithChildrenPropTypes) => {
    return(
        <Alert 
            severity='error'
            sx={style}
            {...props}>{children}</Alert>
    );
}

export default ErrorAlert