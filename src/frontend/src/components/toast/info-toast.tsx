import {ToastPropTypes} from './types'
import BaseToast from './base-toast'


const InfoToast = (props: ToastPropTypes) => {

    return(
        <BaseToast 
            severity='info'
            {...props} />
    )
}

export default InfoToast