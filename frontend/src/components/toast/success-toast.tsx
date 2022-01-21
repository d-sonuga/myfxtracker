import {ToastPropTypes} from './types'
import BaseToast from './base-toast'


const SuccessToast = (props: ToastPropTypes) => {

    return(
        <BaseToast 
            severity='success'
            {...props} />
    )
}

export default SuccessToast