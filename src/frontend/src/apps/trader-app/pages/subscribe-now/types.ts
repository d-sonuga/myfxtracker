import { FlutterwaveConfig } from 'flutterwave-react-v3/dist/types'
import {MutableRefObject} from 'react'

type SubscribeNowPropTypes = {
    userHasPaidOnce: boolean,
    email: string,
    userId: number
}

type SubscriptionButtonPropTypes = Omit<BaseSubscriptionButtonPropTypes, 'config'> & {
    email: string,
    userId: number
}

type BaseSubscriptionButtonPropTypes = {
    config: FlutterwaveConfig,
    abortSubscription: Function,
    onSubscriptionFinished: Function,
    onSubscriptionRecordFailed: Function
}

export type {
    SubscribeNowPropTypes,
    SubscriptionButtonPropTypes,
    BaseSubscriptionButtonPropTypes
}