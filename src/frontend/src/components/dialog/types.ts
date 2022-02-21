import {ReactNode} from 'react'
import {IButtonPropTypes} from '@components/buttons/types'

type DialogPropTypes = {
    children: ReactNode,
    onOkClick: Function,
    onCancelClick: Function,
    okButtonText?: string,
    okButtonColor?: IButtonPropTypes['color'],
    okButtonProps?: {[key: string]: any},
    title: string,
    onClose: Function,
    open: boolean
}

type DialogButtonsPropTypes = Pick<DialogPropTypes, 'okButtonColor' | 'okButtonText' | 'okButtonProps'> & {
    onOkClick: Function,
    onCancelClick: Function
}

export type {
    DialogPropTypes,
    DialogButtonsPropTypes
}