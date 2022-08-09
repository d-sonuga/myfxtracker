import React from 'react'
import logo from '@visuals/images/logo.png'
import {HttpConst} from '@conf/const'
import {SubscriptionButtonPropTypes} from './types'
import BaseSubscriptionButton from './base-subscription-button'
import {MONTHLY_SUBSCRIPTION_PRICE, FLUTTERWAVE_PUBLIC_KEY} from './const'


const MonthlySubscriptionButton = React.forwardRef<HTMLButtonElement, SubscriptionButtonPropTypes>((props, ref) => {
    const {email, userId, ...others} = props;
    const config = {
        public_key: FLUTTERWAVE_PUBLIC_KEY,
        payment_plan: '25383',
        tx_ref: `user-${userId}-date-${Date.now().toString()}`,
        amount: MONTHLY_SUBSCRIPTION_PRICE,
        currency: 'USD',
        payment_options: 'card',
        customer: {
            email,
            name: '',
            phonenumber: ''
        },
        text: '',
        customizations: {
            title: 'MyFxTracker-Monthly',
            description: '',
            logo: `${HttpConst.BASE_URL}${logo}`
        }
    };
    
    return(
        <BaseSubscriptionButton config={config} ref={ref} userId={userId} {...others} />
    )
})

export default MonthlySubscriptionButton