import React from 'react'
import {SubscriptionButtonPropTypes} from './types'
import BaseSubscriptionButton from './base-subscription-button'
import {YEARLY_PLAN_PRICE, YEARLY_PLAN_ID} from './const'


const YearlySubscriptionButton = React.forwardRef<HTMLButtonElement, SubscriptionButtonPropTypes>((props, ref) => {
    const {email, userId, ...others} = props;
    const config = {
        planId: YEARLY_PLAN_ID,
        txRef: `user-${userId}-date-${Date.now().toString()}`,
        amount: YEARLY_PLAN_PRICE,
        email,
        title: 'MyFxTracker-Yearly'
    };
    return(
        <BaseSubscriptionButton config={config} ref={ref} userId={userId} {...others} />
    )
})

export default YearlySubscriptionButton