import React from 'react'
import logo from '@visuals/images/logo.png'
import {HttpConst} from '@conf/const'
import {SubscriptionButtonPropTypes} from './types'
import BaseSubscriptionButton from './base-subscription-button'
import {YEARLY_SUBSCRIPTION_PRICE, FLUTTERWAVE_PUBLIC_KEY} from './const'


const YearlySubscriptionButton = React.forwardRef<HTMLButtonElement, SubscriptionButtonPropTypes>((props, ref) => {
    const {email, userId, ...others} = props;
    const config = {
        public_key: FLUTTERWAVE_PUBLIC_KEY,
        payment_plan: '25387',
        tx_ref: `user-${userId}-date-${Date.now().toString()}`,
        amount: YEARLY_SUBSCRIPTION_PRICE,
        currency: 'USD',
        payment_options: 'card',
        customer: {
            email,
            name: '',
            phonenumber: ''
        },
        text: '',
        customizations: {
            title: 'MyFxTracker-Yearly',
            description: '',
            logo: `${HttpConst.BASE_URL}${logo}`
        }
    };
    return(
        <BaseSubscriptionButton config={config} ref={ref} userId={userId} {...others} />
    )
})

export default YearlySubscriptionButton