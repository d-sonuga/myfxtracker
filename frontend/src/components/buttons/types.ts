import {ComponentWithChildrenPropTypes} from '@components/types'
import {ButtonProps} from '@mui/material'


declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        neutral: true
    }
}

declare module '@mui/material/styles' {
    interface Palette {
        neutral: Palette['primary']
    }
    interface PaletteOptions {
        neutral: PaletteOptions['primary']
    }
}

type IButtonPropTypes = ComponentWithChildrenPropTypes  & Pick<ButtonProps, 'color'> & {
    onClick?: React.MouseEventHandler,
    disabled?: boolean,
    elevation?: boolean,
    type?: 'button' | 'submit' | 'reset',
    'data-testid'?: string
}

type BaseButtonPropTypes = IButtonPropTypes & {
    variant: 'text' | 'contained' | 'outlined'
}

type ButtonPropTypes = IButtonPropTypes

type OutlinedButtonPropTypes = IButtonPropTypes

export type {
    IButtonPropTypes,
    BaseButtonPropTypes,
    ButtonPropTypes,
    OutlinedButtonPropTypes
}