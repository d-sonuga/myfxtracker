import {Alert} from '@mui/material'
import {ComponentWithChildrenPropTypes} from '@components/types'


const SuccessAlert = ({children, style, ...props}: ComponentWithChildrenPropTypes) => {
    return(
        <Alert 
            severity='success'
            sx={style}
            {...props}>{children}</Alert>
    );
}

export default SuccessAlert