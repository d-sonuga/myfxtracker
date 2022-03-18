import {ReactNode} from 'react'
import {IButtonPropTypes} from '@components/buttons/types'

type DialogPropTypes = {
    children: ReactNode,
    onOkClick: Function,
    onCancelClick: Function,
    okButtonContent?: string | ReactNode,
    okButtonColor?: IButtonPropTypes['color'],
    okButtonProps?: {[key: string]: any},
    title: string,
    onClose: Function,
    open: boolean,
    showCancelButton?: boolean
}

type DialogButtonsPropTypes = Pick<
    DialogPropTypes,
    'okButtonColor' |
    'okButtonContent' | 
    'okButtonProps' |
    'showCancelButton'
> & {
    onOkClick: Function,
    onCancelClick: Function
}

export type {
    DialogPropTypes,
    DialogButtonsPropTypes
}