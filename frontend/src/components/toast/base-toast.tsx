import {Fragment, SyntheticEvent} from 'react'
import {Snackbar, Fade, Alert} from '@mui/material'
import {BaseToastPropTypes} from './types'


const BaseToast = ({msg, severity, open, handleClose}: BaseToastPropTypes) => {

    return(
        <Fragment>
            <Snackbar
                open={open}
                TransitionComponent={Fade}
                anchorOrigin={{
                    vertical: 'top', 
                    horizontal: 'center'
                }}
                onClose={handleClose}>
                    <Alert
                        onClose={handleClose}
                        severity={severity}
                        variant='filled'
                        sx={{
                            maxWidth: 300
                        }}>
                        {msg}
                    </Alert>
            </Snackbar>
        </Fragment>
    )
}

export default BaseToast