import {createContext} from 'react'
import ErrorToast from './error-toast'
import SuccessToast from './success-toast'
import {ToastFuncType} from './types'


const ToastContext = createContext<ToastFuncType>({
    error: () => {}
});

export {
    ErrorToast,
    SuccessToast,
    ToastContext
}