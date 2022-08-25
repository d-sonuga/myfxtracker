import React from 'react'
import {SubscriptionButtonPropTypes} from './types'
import BaseSubscriptionButton from './base-subscription-button'
import {MONTHLY_PLAN_PRICE, MONTHLY_PLAN_ID} from './const'


const MonthlySubscriptionButton = React.forwardRef<HTMLButtonElement, SubscriptionButtonPropTypes>((props, ref) => {
    const {email, userId, ...others} = props;
    const config = {
        planId: MONTHLY_PLAN_ID,
        txRef: `user-${userId}-date-${Date.now().toString()}`,
        amount: MONTHLY_PLAN_PRICE,
        email,
        title: 'MyFxTracker-Monthly'
    };
    
    return(
        <BaseSubscriptionButton config={config} ref={ref} userId={userId} {...others} />
    )
})

export default MonthlySubscriptionButton