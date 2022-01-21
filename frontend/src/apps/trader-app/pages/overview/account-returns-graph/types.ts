import {GraphData} from '@apps/trader-app/components'

type HeaderPropTypes = {
    onPeriodChange: {
        (period: string): void
    }
}

type GraphPropTypes = {
    data?: GraphData,
    options?: {
        [key: string]: GraphData
    }
}

export type {
    HeaderPropTypes,
    GraphPropTypes
}