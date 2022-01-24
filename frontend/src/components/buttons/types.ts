import {ComponentWithChildrenPropTypes} from '@components/types'

interface IButtonPropTypes extends ComponentWithChildrenPropTypes {
    onClick?: React.MouseEventHandler,
    disabled?: boolean,
    elevation?: boolean,
    type?: 'button' | 'submit' | 'reset'
}

interface BaseButtonPropTypes extends IButtonPropTypes {
    variant: 'text' | 'contained' | 'outlined'
}

interface ButtonPropTypes extends IButtonPropTypes {}

interface OutlinedButtonPropTypes extends IButtonPropTypes {}

export type {
    BaseButtonPropTypes,
    ButtonPropTypes,
    OutlinedButtonPropTypes
}