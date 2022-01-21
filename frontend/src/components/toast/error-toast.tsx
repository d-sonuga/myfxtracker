import {ToastPropTypes} from './types'
import BaseToast from './base-toast'


const ErrorToast = (props: ToastPropTypes) => {

    return(
        <BaseToast 
            severity='error'
            {...props} />
    )
}

export default ErrorToast