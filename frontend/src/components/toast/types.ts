import {AlertColor} from '@mui/material'
import {SyntheticEvent} from 'react'


type ToastPropTypes = {
    open: boolean,
    handleClose: (e?: SyntheticEvent | Event, reason?: string) => void,
    msg: string
}

type BaseToastPropTypes = ToastPropTypes & {
    severity: AlertColor
}

type ToastFuncType = {
    error: Function
}

export type {
    BaseToastPropTypes,
    ToastPropTypes,
    ToastFuncType
}