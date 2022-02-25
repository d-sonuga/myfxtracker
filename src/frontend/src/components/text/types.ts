import {ComponentWithChildrenPropTypes} from '@components/types'

interface TextPropTypes extends ComponentWithChildrenPropTypes {
    children: string | string[],
    onClick?: Function
}

interface BaseTextPropTypes extends TextPropTypes {
    variant: 'button' | 'caption' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'overline' | 'inherit'
}

interface HPropTypes extends TextPropTypes {}

interface PPropTypes extends TextPropTypes {}

export type {
    BaseTextPropTypes,
    HPropTypes,
    PPropTypes
}
