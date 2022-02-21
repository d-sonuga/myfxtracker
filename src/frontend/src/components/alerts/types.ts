import {AlertColor} from '@mui/material'
import {ComponentWithChildrenPropTypes} from '@components/types'


type BaseAlertPropTypes = ComponentWithChildrenPropTypes & {
    severity: AlertColor
};

export type {
    BaseAlertPropTypes
}