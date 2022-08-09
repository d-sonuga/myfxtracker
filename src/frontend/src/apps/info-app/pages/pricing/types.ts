import {ReactNode} from 'react'

type PricingPagePropTypes = {
    navbar: ReactNode,
    subscribeContent: {
        monthly: ReactNode,
        yearly: ReactNode
    },
    subscribeAction: {
        monthly: Function,
        yearly: Function
    },
    subscribeEnabled: {
        monthly: boolean,
        yearly: boolean
    },
    style?: {[key: string]: any}
}

type PriceProposalPropTypes = Omit<PricingPagePropTypes, 'navbar'>

export type {
    PricingPagePropTypes,
    PriceProposalPropTypes
}
