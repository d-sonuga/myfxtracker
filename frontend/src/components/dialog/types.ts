import {ReactNode} from 'react'

type DialogPropTypes = {
    children: ReactNode,
    onOkClick: Function,
    onCancelClick: Function,
    title: string,
    onClose: Function,
    open: boolean
}

type DialogButtonsPropTypes = {
    onOkClick: Function,
    onCancelClick: Function
}

export type {
    DialogPropTypes,
    DialogButtonsPropTypes
}