import {FlutterwaveConfig} from 'flutterwave-react-v3/dist/types'

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
    onSubscriptionRecordFailed: Function,
    userId: number
}

export type {
    SubscribeNowPropTypes,
    SubscriptionButtonPropTypes,
    BaseSubscriptionButtonPropTypes
}