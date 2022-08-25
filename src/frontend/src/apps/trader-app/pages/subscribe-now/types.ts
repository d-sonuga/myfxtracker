import {FlutterwaveConfig} from 'flutterwave-react-v3/dist/types'

type SubscribeNowPropTypes = {
    userHasPaidOnce: boolean,
    email: string,
    userId: number,
    referrerUsername: string
}

type SubscriptionButtonPropTypes = Omit<BaseSubscriptionButtonPropTypes, 'config'> & {
    email: string,
    userId: number
}

type BaseSubscriptionButtonPropTypes = {
    config: {
        planId: string,
        amount: number,
        email: string,
        title: string,
        txRef: string
    },
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