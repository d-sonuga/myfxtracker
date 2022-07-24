import {ReactNode} from 'react'

type PlanInfoPropTypes = {
    show: boolean,
    price: number,
    extraInfo?: string | string[],
    subscribeButtonContent: ReactNode,
    subscribeButtonAction: Function,
    subscribeButtonEnabled: boolean
}

export type {
    PlanInfoPropTypes
}