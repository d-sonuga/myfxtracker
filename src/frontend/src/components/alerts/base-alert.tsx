import {Alert} from '@mui/material'
import {BaseAlertPropTypes} from './types';


const BaseAlert = ({children, style, ...props}: BaseAlertPropTypes) => {
    return(
        <Alert
            sx={style}
            {...props}>{children}</Alert>
    );
}

export default BaseAlert