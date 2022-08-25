import {ReactNode} from 'react'

type PricingPagePropTypes = {
    navbar: ReactNode,
    plans: Plan[],
    defaultPlanIndex: number,
    style?: {[key: string]: any}
}

type PriceProposalPropTypes = Omit<PricingPagePropTypes, 'navbar'>

type Plan = {
    name: string,
    price: number,
    subscribeButtonContent: ReactNode,
    subscribeButtonAction: Function,
    subscribeButtonEnabled: boolean
}

export type {
    PricingPagePropTypes,
    PriceProposalPropTypes,
    Plan
}
